import { WithMessage } from "@my/domain/model/utility";
import { flow } from "effect";
import * as Chunk from "effect/Chunk";
import * as Console from "effect/Console";
import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as O from "effect/Option";
import * as Ref from "effect/Ref";
import * as Schema from "effect/Schema";
import * as Scope from "effect/Scope";
import * as Stream from "effect/Stream";
import { wsUrl } from "../config.ts";

const toChunk = flow(
  x => x as ArrayBuffer,
  new TextDecoder("utf-8").decode,
  x => Chunk.fromIterable([x]),
);

const WsClientServiceId: unique symbol =
  Symbol.for("@my/client/services/WsClient");

type WsClientId = typeof WsClientServiceId;

export class CannotConnect
  extends Schema.TaggedError<CannotConnect>(WsClientServiceId.toString()
    + "/CannotConnect")(
    "CannotConnect",
    {
      message: Schema.String,
    },
  ) {}

export class NoConnection
  extends Schema.TaggedError<NoConnection>(WsClientServiceId.toString()
    + "/NoConnection")(
    "NoConnection", WithMessage("No connection"),
  ) {}

export class CannotSend
  extends Schema.TaggedError<CannotSend>(WsClientServiceId.toString()
    + "/CannotSend")(
    "CannotSend", {
      message: Schema.String,
    },
  ) {}

export const WsClientError = Schema.Union(
  CannotConnect,
  CannotSend,
  NoConnection,
);
export type WsClientError = Schema.Schema.Type<typeof WsClientError>;

interface WsClient {
  readonly connectWith: (token: string) => Effect.Effect<void, WsClientError, Scope.Scope>;
  readonly messages: Stream.Stream<string, WsClientError>;
  readonly send: (data: string) => Effect.Effect<void, WsClientError, Scope.Scope>;
  readonly close: () => Effect.Effect<void, never, Scope.Scope>;
}

class WsClientImpl implements WsClient {
  private wsRef: Ref.Ref<O.Option<WebSocket>> = Ref.unsafeMake(O.none());

  constructor(private readonly url: string) {
  }

  close = () =>
    this.wsRef.pipe(
      Ref.get,
      Effect.map(
        O.flatMap(O.liftThrowable(ws => ws.close())),
      ),
      Effect.flatMap(() => Ref.set(this.wsRef, O.none())),
    );

  send = (data: string) =>
    this.wsRef.pipe(
      Ref.get,
      Effect.flatMap(
        O.match({
          onNone: () => Effect.fail(new NoConnection()),
          onSome: ws => Effect.succeed(ws),
        }),
      ),
      Effect.flatMap(ws =>
        Effect.try({
          try: () => ws.send(data),
          catch: e => new CannotSend({
            message: (
              e as DOMException
            ).message,
          }),
        }),
      ),
    );

  connectWith = (token: string) =>
    Effect.try({
      // @misha: use URL()
      try: () => new WebSocket(`${this.url}?token=${token}`),
      catch: e => {
        return new CannotConnect({ message: `Cannot connect: ${e}` });
      },
    }).pipe(
      Effect.flatMap(
        client =>
          Effect.async<WebSocket, CannotConnect>(resume => {
            client.onopen = () => {
              return resume(Effect.succeed(client));
            };
            client.onerror = e => {
              return resume(Effect.fail(new CannotConnect({ message: "Cannot connect." })));
            };
            return Effect.sync(() => { client.close(); });
          }),
      ),
      Effect.flatMap(ws => this.wsRef.pipe(Ref.set(O.some(ws)))),
    );

  readonly messages = Stream.asyncEffect<string, WsClientError>(
    emit => this.wsRef.pipe(
      Ref.get,
      Effect.flatMap(
        O.match({
          onNone: () => Effect.fail(new NoConnection()),
          onSome: ws => Effect.succeed(ws),
        }),
      ),
      Effect.map(ws => {
        ws.on(
          "message",
          data => {
            void emit(Effect.succeed(toChunk(data)));
          },
        );
      }),
    ),
  );
}

export class WsClientService extends Context.Tag(WsClientServiceId.toString())<
  WsClientService, WsClient
>() {
  public static live = Layer.effect(
    WsClientService,
    wsUrl.pipe(
      Effect.andThen(url => new WsClientImpl(url)),
    ),
  );
}
