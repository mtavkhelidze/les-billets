import { flow } from "effect";
import * as Chunk from "effect/Chunk";
import * as Context from "effect/Context";
import * as Data from "effect/Data";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as O from "effect/Option";
import * as Stream from "effect/Stream";

import { type RawData, WebSocketServer } from "ws";
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
    Effect.andThen(() => Effect.logInfo("Server socket closed")),
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

export class MessageStreamError extends Data.TaggedError("MessageStreamError")<{
  originalError: Error
}> {}

export class RawDataToStringError
  extends Data.TaggedError("MessageStreamError")<{
    originalError: unknown
  }> {}

export const rawDataToString: (data: RawData) => Effect.Effect<string, RawDataToStringError> = (data: RawData) =>
  Effect.try({
    try: () => {
      if (data instanceof Buffer) {
        return data.toString();
      }
      if (data instanceof ArrayBuffer) {
        return Buffer.from(data).toString();
      }
      if (Array.isArray(data)) {
        return data.map(d => rawDataToString(d)).join("");
      }
      throw new Error("Cannot read message data.");
    },
    catch: (e: unknown) => new RawDataToStringError({ originalError: e }),
  });

export const createMessageStream = (ws: WebSocket): Stream.Stream<RawData, MessageStreamError> =>
  Stream.async(emit => {
    ws.on("message", (data: RawData) => {
      void emit(Effect.succeed(Chunk.of(data)));
    });
    ws.on("error", (err) => {
      void emit(
        Effect.fail(O.some(new MessageStreamError({ originalError: err }))),
      );
    });
    ws.on("close", () => {
      void emit(Effect.fail(O.none()));
    });
  });

export const createConnectionStream = (wss: WebSocketServer): Stream.Stream<WebSocket, WsServerError> => {
  return Stream.async<WebSocket, WsServerError>(
    emit => {

      wss.on("connection", (ws: WebSocket) => {
        void emit(Effect.succeed(Chunk.of(ws)));
      });

      wss.on("close", (ws: WebSocket) => {
        void emit(Effect.zipLeft(
          Effect.fail(O.none()),
          Effect.logInfo("Websocket closed"),
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
  Effect.zipRight(
    Effect.logInfo("Starting server..."),
    WsIncomingStreamService.pipe(
      Effect.flatMap(
        Stream.runForEach(flow(connectionHandler, Effect.fork)),
      ),
    ),
  ),
);
