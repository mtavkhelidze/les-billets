import * as Chunk from "effect/Chunk";
import * as Context from "effect/Context";
import * as Data from "effect/Data";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as O from "effect/Option";
import * as Scope from "effect/Scope";
import * as Stream from "effect/Stream";
import * as uuid from "uuid";

import { type AddressInfo, WebSocketServer } from "ws";
import { serverPort } from "../config.ts";

class WebSocketError extends Data.TaggedError("ServerSocketError")<{
  error: Error
}> {}

const silentlyStopServer = (ws: WebSocketServer): Effect.Effect<void> =>
  Effect.async((cb, signal) => {
    ws.clients.forEach((cl) => {
      cl.close();
    });
    ws.close(() => {
      cb(Effect.void);
    });
  }).pipe(
    Effect.catchAll(
      e => Effect.logInfo("Cannot stop server", e)),
    Effect.andThen(
      () => Effect.logInfo("Server shutdown."),
    ),
  );

const addressString = (ai: AddressInfo | string | null): string =>
  ai
    ? typeof ai == "string"
      ? ai
      : `${ai.family} address ${ai.address}:${ai.port}`
    : "unknown";

const acquireServer: Effect.Effect<WebSocketServer, WebSocketError, Scope.Scope> =
  Effect.acquireRelease(
    serverPort.pipe(
      Effect.map(port => new WebSocketServer({
        // @misha: verifyClient...
        port: port,
      })),
      Effect.tap(
        ws => Effect.logInfo(`Server @ ${addressString(ws.address())}`),
      ),
      Effect.catchAll(
        _ => Effect.fail(new WebSocketError({
          error: new Error("Cannot start server: configuration error"),
        })),
      ),
    ),
    silentlyStopServer,
  )
;

export interface WebSocketConnection {
  id: string;
  ws: WebSocket;
}

export const mkConnectionsStream = (wss: WebSocketServer): Stream.Stream<WebSocketConnection, WebSocketError> => {
  return Stream.async<WebSocketConnection, WebSocketError>(
    emit => {
      // @misha: change that when authorization will be implemented
      let id: string;
      wss.on("connection", (ws: WebSocket, req) => {
        id = uuid.v4();
        void emit(
          Effect.zipLeft(
            Effect.succeed(Chunk.of({ id, ws })),
            Effect.log(`Connection: ${id}`),
          ),
        );
      });

      wss.on("close", () => {
        void emit(
          Effect.zipLeft(
            Effect.fail(O.none()),
            Effect.logInfo(`Connections closed: ${id}`),
          ));
      });
      wss.on("error", error => {
        void emit(
          Effect.zipLeft(
            Effect.fail(O.some(new WebSocketError({ error }))),
            Effect.logWarning(`Connection error: ${id}`, { error }),
          ));
      });
    },
  );
};


export class ConnectionStreamService extends Context.Tag(
  "ConnectionStreamService")<
  ConnectionStreamService,
  Stream.Stream<WebSocketConnection, WebSocketError>
>() {
  public static live = Layer.scoped(
    ConnectionStreamService,
    acquireServer.pipe(
      Effect.map(mkConnectionsStream),
    ),
  );
}
