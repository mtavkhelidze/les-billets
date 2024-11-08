import * as Data from "effect/Data";
import * as Effect from "effect/Effect";
import { pipe } from "effect/Function";
import * as Layer from "effect/Layer";
import * as Stream from "effect/Stream";
import type { RawData } from "ws";
import { runBunMain } from "./runtime.ts";
import {
  mkMessageStream,
  rawDataToString,
  WsConnectionsStream,
  WsStreamServer,
} from "./wsServer.ts";

const handleClientMessage = (message: RawData) =>
  pipe(
    rawDataToString(message),
    Effect.andThen(Effect.logInfo),
  );

export class TimeoutError extends Data.TaggedError("TimeoutError") {}

export const handleClientConnection = (wsc: WebSocket) => Effect.gen(function* (_) {
  yield* _(Effect.logInfo("New connection."));
  const processMessages = pipe(
    mkMessageStream(wsc),
    Stream.runForEach(handleClientMessage),
    Stream.timeoutFail(() => new TimeoutError(), "5 seconds"),
    Stream.runDrain,
  ).pipe(Effect.withSpan("handleClientConnection"));

  yield* _(
    Effect.raceAll([processMessages]),
    Effect.catchAll(e => Effect.logInfo(`Client disconnected: ${e}.`)),
    Effect.ignore,
  );
});

const main = Effect.gen(function* (_) {
  yield* _(
    Layer.launch(WsStreamServer(handleClientConnection)),
  );
});

runBunMain(
  main.pipe(
    Effect.provide(WsConnectionsStream.live),
  ),
);
