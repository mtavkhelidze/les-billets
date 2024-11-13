import * as Chunk from "effect/Chunk";
import * as Context from "effect/Context";
import * as Data from "effect/Data";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as O from "effect/Option";
import * as Scope from "effect/Scope";
import * as Stream from "effect/Stream";

import { type AddressInfo, WebSocketServer } from "ws";
import { AppLogLevel, serverPort } from "../config.ts";

class WebSocketError extends Data.TaggedError("ServerSocketError")<{
  error: Error
}> {}

const silentlyShutdown = (ws: WebSocketServer): Effect.Effect<void> =>
  Effect.async((cb, signal) => {
    // @misha: not sure if this is the right place
    if (signal) {
      process.exit(signal.aborted ? 1 : 0);
    }
    ws.clients.forEach((cl) => {
      cl.close();
    });
    ws.close(() => {
      cb(Effect.void);
    });
  }).pipe(
    Effect.catchAll(
      e => Effect.logDebug(`Error stopping server: ${e}`)),
    Effect.andThen(
      () => Effect.logInfo("Server shutdown"),
    ),
  );

const addressString = (ai: AddressInfo | string | null): string =>
  ai
    ? typeof ai == "string"
      ? ai
      : `${ai.family}(${ai.address}:${ai.port})`
    : "unknown";

const mkServer = (port: number): Effect.Effect<WebSocketServer, WebSocketError, Scope.Scope> => {
  const ws = new WebSocketServer({
    // @misha: verifyClient...
    clientTracking: true,
    port,
  });
  return Effect.acquireRelease(
    Effect.succeed(ws),
    silentlyShutdown,
  );
};

export const mkStream = (wss: WebSocketServer): Stream.Stream<WebSocket, WebSocketError> =>
  Stream.async<WebSocket, WebSocketError>(
    emit => {
      wss.on("connection", (ws: WebSocket, req) => {
        void emit(
          Effect.succeed(
            Chunk.of(ws),
          ),
        );
      });
      wss.on("close", () => {
        void emit(
          Effect.fail(
            O.none(),
          ),
        );
      });
      wss.on("error", error => {
        void emit(
          Effect.fail(
            O.some(
              new WebSocketError({ error }),
            ),
          ),
        );
      });
    });


export class ConnectionsStream extends Context.Tag(
  "ConnectionsStream")<
  ConnectionsStream,
  Stream.Stream<WebSocket, WebSocketError>
>() {
  public static live = Layer.scoped(
    ConnectionsStream,
    serverPort.pipe(
      Effect.andThen(mkServer),
      Effect.tap(server => Effect.logInfo(`Server started: ${addressString(
        server.address())}`)),
      Effect.andThen(mkStream),
      Effect.provide(AppLogLevel.layer),
    ),
  );
}

