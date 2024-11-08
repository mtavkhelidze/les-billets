import * as Effect from "effect/Effect";
import * as Stream from "effect/Stream";
import * as Layer from "effect/Layer";

import {bunRunProgram} from "./runtime.ts";
import {
  type WebSocketConnection,
  WebSocketConnectionStreamService
} from "./services/./WebSocketConnectionStreamService.ts";
import {
  ClientMessageStreamService
} from "./services/ClientMessageStreamService.ts";
import {RuntimeException} from "effect/Cause";
//
// const handleClientMessage = (message: RawData) =>
//   pipe(
//     rawDataToString(message),
//     Effect.andThen(Effect.logInfo),
//   );
//
// export class TimeoutError extends Data.TaggedError("TimeoutError") {}
//
// export const handleClientConnection = (wsc: WebSocket) => Effect.gen(function* (_) {
//   yield* _(Effect.logInfo("New connection."));
//   const processMessages = pipe(
//     mkMessageStream(wsc),
//     Stream.runForEach(handleClientMessage),
//     Stream.timeoutFail(() => new TimeoutError(), "5 seconds"),
//     Stream.runDrain,
//   ).pipe(Effect.withSpan("handleClientConnection"));
//
//   yield* _(
//     Effect.raceAll([processMessages]),
//     Effect.catchAll(e => Effect.logInfo(`Client disconnected: ${e}.`)),
//     Effect.ignore,
//   );
// });
const runClientMessageStream = (wc: WebSocketConnection) =>
  ClientMessageStreamService.pipe(
    Effect.andThen(service => service.create(wc.ws)),
    Effect.andThen(Stream.runForEach(x => Effect.logInfo(x))),
  )

const program = WebSocketConnectionStreamService.pipe(
  Effect.andThen(
    Stream.runForEach(runClientMessageStream)
  )
)

bunRunProgram(
  program.pipe(
    Effect.provide(Layer.mergeAll(
        ClientMessageStreamService.live,
        WebSocketConnectionStreamService.live,
      )
    )
  )
)
