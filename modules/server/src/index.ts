import { flow, pipe, Schedule } from "effect";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Stream from "effect/Stream";
import { AppLogLevel, keepAliveInterval } from "./config.ts";
import { bunRunProgram } from "./runtime.ts";
import { ConnectionRegistry } from "./services/ConnectionRegistry.ts";
import { ConnectionsStream } from "./services/ConnectionsStream.ts";
import { MessageDeliveryService } from "./services/MessageDeliveryService.ts";

const acceptConnections =
  Effect.scoped(pipe(
      Effect.all([ConnectionsStream, ConnectionRegistry]),
      Effect.andThen(([stream, registry]) =>
        stream.pipe(
          Stream.runForEachScoped(
            flow(
              registry.add,
              Effect.andThen(id => Effect.logDebug(`${id}: connected`)),
              Effect.andThen(registry.size),
              Effect.andThen(size => Effect.logDebug(`Total connections: ${size}`)),
            ),
          ),
        ),
      ),
      Effect.catchAll(e => Effect.logDebug(`Error accepting connections: ${e}`)),
    ),
  );

export const keepAlivePinger =
  keepAliveInterval.pipe(
    Effect.tap(interval => Effect.logDebug(`Keep-Alive: ${interval}`)),
    Effect.andThen(interval => pipe(
        Effect.all([ConnectionRegistry]),
        Effect.andThen(([registry]) =>
          Effect.repeat(
            registry.allIds.pipe(
              Stream.fromIterableEffect,
              Stream.runForEach(cid => registry.pingOrForget(cid)),
            ),
            Schedule.spaced(interval),
          ),
        ),
      ),
    ),
  );

bunRunProgram(
  Effect.raceAll([
    acceptConnections,
    keepAlivePinger,
  ])
    .pipe(
      Effect.provide(
        Layer.mergeAll(
          AppLogLevel.layer,
          ConnectionRegistry.live,
          ConnectionsStream.live,
          MessageDeliveryService.live,
        ),
      ),
    ),
);
