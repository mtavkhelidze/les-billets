import * as Effect from "effect/Effect";
import { constVoid } from "effect/Function";
import * as Layer from "effect/Layer";
import { runBunMain } from "./runtime.ts";
import { WsIncomingStreamService, WsStreamServer } from "./wsServer.ts";

const handleClientConnection = (wsc: WebSocket) => Effect.gen(function* (_) {
  yield* _(Effect.log("New connection"));
  yield* _(
    Effect.fail(constVoid()),
  );

}).pipe(Effect.withSpan("handleClientConnection"));

const main = Effect.gen(function* (_) {
  yield* _(Effect.logInfo("Begin"));
  yield* _(
    Layer.launch(WsStreamServer(handleClientConnection)),
  );
});

runBunMain(
  main.pipe(
    Effect.provide(WsIncomingStreamService.live),
  ),
);
