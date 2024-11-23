import { Exit, flow, Layer } from "effect";
import * as Chunk from "effect/Chunk";
import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";
import * as Scope from "effect/Scope";
import * as Stream from "effect/Stream";
import WebSocket from "isomorphic-ws";
import { wsUrl } from "../config.ts";

const toChunk = flow(
  x => x as ArrayBuffer,
  new TextDecoder("utf-8").decode,
  x => Chunk.fromIterable([x]),
);

const WsClientId: unique symbol =
  Symbol.for("@my/client/services/WsClient");

type WsClientId = typeof WsClientId;

export class WsClientError
  extends Schema.TaggedError<WsClientError>(WsClientId.toString()
    + "/WsClientError")(
    "WsClientError",
    {
      message: Schema.String,
    },
  ) {}

interface WsClient {
  readonly [WsClientId]: WsClientId;
  readonly send: (data: string) => Effect.Effect<void, WsClientError, Scope.Scope>;
  readonly messages: Stream.Stream<string, WsClientError>;
}

export const WsClientService =
  Context.GenericTag<WsClientId, WsClient>(WsClientId.toString());

const acquire = (url: string) =>
  Effect.suspend(() => Effect.succeed(new WebSocket(url))).pipe(
    Effect.flatMap(client =>
      Effect.async<WebSocket, WsClientError>(resume => {
        client.onopen = () => {
          return resume(Effect.succeed(client));
        };
        client.onerror = e => {
          return resume(Effect.fail(new WsClientError({ message: "Cannot connect." })));
        };
        return Effect.sync(() => {
          client.close();
        });
      }),
    ),
  );

const use = (ws: WebSocket) =>
  Effect.succeed(WsClientService.of({
      [WsClientId]: WsClientId,
      messages: Stream.async(emit => {
        ws.on(
          "message",
          data => { void emit(Effect.succeed(toChunk(data))); },
        );
      }),
      send: data => Effect.try({
        try: () => ws.send(data),
        catch: e => new WsClientError({
          message: (
            e as DOMException
          ).message,
        }),
      }),
    }),
  );

const release = (
  _: WebSocket,
  exit: Exit.Exit<WsClient, WsClientError>,
) => exit.pipe(Effect.catchAll(e => Effect.logDebug(e)));

export const WsClientServiceLive = Layer.effect(
  WsClientService,
  wsUrl.pipe(
    Effect.andThen(
      url => Effect.acquireUseRelease(acquire(url), use, release),
    ),
    Effect.scoped,
  ),
);
