import * as Chunk from "effect/Chunk";
import * as Context from "effect/Context";
import * as Data from "effect/Data";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as List from "effect/List";
import * as O from "effect/Option";
import * as Schedule from "effect/Schedule";
import * as Scope from "effect/Scope";
import * as Stream from "effect/Stream";
import * as uuid from "uuid";

import { type AddressInfo, WebSocketServer } from "ws";
import { AppLogLevel, keepAliveInterval, serverPort } from "../config.ts";
import { ClientRegistry } from "../dispatcher/ClientRegistry.ts";

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
      () => Effect.logInfo("Server shutdown."),
    ),
  );

const addressString = (ai: AddressInfo | string | null): string =>
  ai
    ? typeof ai == "string"
      ? ai
      : `${ai.family} address ${ai.address}:${ai.port}`
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

export interface WebSocketConnection {
  id: string;
  ws: WebSocket;
}

export const mkStream = (wss: WebSocketServer): Stream.Stream<WebSocketConnection, WebSocketError> => {
  return Stream.async<WebSocketConnection, WebSocketError>(
    emit => {
      // @misha: change that when authorization will be implemented
      let id: string;
      wss.on("connection", (ws: WebSocket, req) => {
        id = uuid.v4();
        void emit(
          Effect.zipLeft(
            Effect.succeed(Chunk.of({ id, ws })),
            Effect.logDebug(`${id} connected.`),
          ),
        );
      });
      wss.on("close", () => {
        void emit(
          Effect.zipLeft(
            Effect.fail(O.none()),
            Effect.logDebug(`${id} closed.`),
          ));
      });
      wss.on("error", error => {
        void emit(
          Effect.zipLeft(
            Effect.fail(O.some(new WebSocketError({ error }))),
            Effect.logWarning(`${id} error.`, { error }),
          ));
      });
    },
  );
};


export class ConnectionsStream extends Context.Tag(
  "ConnectionsStream")<
  ConnectionsStream,
  Stream.Stream<WebSocketConnection, WebSocketError>
>() {
  public static live = Layer.scoped(
    ConnectionsStream,
    serverPort.pipe(
      Effect.andThen(mkServer),
      Effect.andThen(mkStream),
      Effect.provide(AppLogLevel.layer),
    ),
  );
}

const sendPing = (wsc: WebSocketConnection) =>
  Effect.async<void, WebSocketConnection>(resume => {
    wsc.ws.ping("", undefined, error => {
      if (error) {
        return resume(
          Effect.logDebug(`${wsc.id} gone.`).pipe(
            Effect.andThen(Effect.fail(wsc)),
          ),
        );
      }
    });
    resume(Effect.void);
  }).pipe(
    Effect.catchAll(error => Effect.fail(error)),
  );

export const keepAliveProcess =
  keepAliveInterval.pipe(
    Effect.tap(interval => Effect.logDebug(`Keep alive: ${interval}`)),
    Effect.andThen(
      interval =>
        ClientRegistry.pipe(
          Effect.andThen(
            registry => registry.all.pipe(
              Effect.andThen(List.toArray),
              Effect.andThen(
                list => Stream.fromIterable(list).pipe(
                  Stream.tap(sendPing),
                  Stream.catchAll(registry.remove),
                  Stream.runCollect,
                ),
              ),
              Effect.repeat(Schedule.spaced(interval)),
            ),
          ),
        ),
    ),
  );
