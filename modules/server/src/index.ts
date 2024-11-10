import { pipe } from "effect";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
// noinspection ES6UnusedImports
import * as  List from "effect/List";
import * as Stream from "effect/Stream";
import { AppLogLevel } from "./config.ts";
import { ClientRegistry } from "./dispatcher/ClientRegistry.ts";
import { bunRunProgram } from "./runtime.ts";
import {
  ConnectionsStream,
  keepAliveProcess,
} from "./services/ConnectionsStream.ts";
import {
  DatabaseDriver,
  DataStorageService,
} from "./services/DataStorageService.ts";
import { MessageProcessorService } from "./services/MessageProcessorService.ts";
import { MessageStreamService } from "./services/MessageStreamService.ts";

const acceptConnections =
  pipe(
    Effect.all([ConnectionsStream, ClientRegistry]),
    Effect.andThen(([connections, registry]) =>
      connections.pipe(
        Stream.flatMap(registry.add),
        Stream.tap(n => Effect.logDebug(`Total clients: ${n}`)),
        Stream.runDrain,
      ),
    ),
    Effect.catchAll(e => Effect.logDebug(`Error accepting connections: ${e}`)),
    Effect.ignore,
  );

bunRunProgram(
  Effect.raceAll([
    acceptConnections,
    keepAliveProcess,
  ])
    .pipe(
      Effect.provide(
        Layer.mergeAll(
          AppLogLevel.layer,
          ConnectionsStream.live,
          DataStorageService.live,
          DatabaseDriver.live,
          MessageProcessorService.live,
          MessageStreamService.live,
        ),
      ),
      Effect.provideService(ClientRegistry, ClientRegistry.live),
    ),
);
