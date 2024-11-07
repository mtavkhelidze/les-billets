import { flow } from "effect";
import * as Chunk from "effect/Chunk";
import * as Context from "effect/Context";
import * as Data from "effect/Data";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as O from "effect/Option";
import * as Stream from "effect/Stream";

import { WebSocketServer } from "ws";
import { wsPort } from "./config.ts";


const closeWsServer = (ws: WebSocketServer): Effect.Effect<void, never, never> =>
  Effect.async((cb) => {
    ws.clients.forEach(cl => {
      cl.close();
    });
    ws.close(() => {
      cb(Effect.void);
    });
  }).pipe(
    Effect.andThen(() => Effect.log("Server socket closed")),
  );

export const createWsServer = Effect.acquireRelease(
  wsPort.pipe(
    Effect.flatMap(port => Effect.sync(() => new WebSocketServer({ port }))),
  ),
  closeWsServer,
);


export class WsServerError extends Data.TaggedError("ServerSocketError")<{
  originalError: Error
}> {}


export const createConnectionStream = (wss: WebSocketServer): Stream.Stream<WebSocket, WsServerError> => {
  return Stream.async<WebSocket, WsServerError>(
    emit => {

      wss.on("connection", (ws: WebSocket) => {
        void emit(Effect.succeed(Chunk.of(ws)));
      });

      wss.on("close", (ws: WebSocket) => {
        void emit(Effect.zipLeft(
          Effect.fail(O.none()),
          Effect.log("Websocket closed"),
        ));
      });

      wss.on("error", err => {
        void emit(
          Effect.zipLeft(
            Effect.fail(O.some(new WsServerError({ originalError: err }))),
            Effect.logWarning("Websocket failed", err),
          ));
      });
    },
  );
};


export class WsIncomingStreamService extends Context.Tag(
  "WsIncomingStreamService")<
  WsIncomingStreamService,
  Stream.Stream<WebSocket, WsServerError, never>
>() {
  public static live = Layer.scoped(
    WsIncomingStreamService,
    createWsServer.pipe(Effect.map(createConnectionStream)),
  );
}

export const WsStreamServer = (connectionHandler: (ws: WebSocket) => Effect.Effect<void, void>) => Layer.scopedDiscard(
  WsIncomingStreamService.pipe(
    Effect.flatMap(Stream.runForEach(flow(connectionHandler, Effect.fork))),
  ),
).pipe(
  Layer.withSpan("WsStreamServer"),
);
