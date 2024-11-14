import { pipe } from "effect";
import * as Context from "effect/Context";
import * as Data from "effect/Data";
import * as DateTime from "effect/DateTime";
import * as Effect from "effect/Effect";
import * as HashMap from "effect/HashMap";
import * as Layer from "effect/Layer";
import * as Ref from "effect/Ref";
import * as Tuple from "effect/Tuple";
import {
  type ServerMessage,
  serverMessageToJson,
  ServerPing,
} from "../../../domain/src";
import * as uuid from "uuid";
import { MessageDeliveryService } from "./MessageDeliveryService.ts";


class ConnectionRegistryError extends Data.TaggedError("ServerSocketError")<{
  error: Error
}> {
  public static make(error: Error): ConnectionRegistryError {
    return new ConnectionRegistryError({ error });
  }
}

export type CID = string;

export interface WebSocketConnection {
  id: CID;
  ws: WebSocket;
}

class ConnectionMapRegistry {
  /**
   * Try  a ping. Remove from registry if there happens to be an error.
   */
  public pingOrForget = (cid: CID): Effect.Effect<void, never, MessageDeliveryService> =>
    pipe(
      DateTime.now,
      Effect.map(utc => ServerPing.make({ utc })),
      Effect.andThen(this.sendOrForget(cid, true)),
    );

  /**
   * Try to send a message or a ping. Remove from
   * registry if there happens to be an error.
   */
  public sendOrForget = (
    cid: CID,
    ping: boolean = false,
  ) => (message: ServerMessage): Effect.Effect<void, never, MessageDeliveryService> =>
    pipe(
      Effect.zip(
        this.clients.pipe(
          Ref.get,
          Effect.andThen(HashMap.get(cid)),
        ),
        serverMessageToJson(message),
      ),
      Effect.andThen(([ws, json]) =>
        MessageDeliveryService.pipe(
          Effect.andThen(delivery => ping
            ? delivery.sendPing(ws)
            : delivery.sendData(ws)(json),
          ),
        ),
      ),
      Effect.catchAll(e => {
          if (e._tag === "MessageDeliveryError") {
            return this.remove(cid).pipe(
              Effect.andThen(() => Effect.logDebug(`${cid}: gone`)),
            );
          }
          return Effect.void;
        },
      ),
      Effect.ignoreLogged,
    );

  public readonly add = (ws: WebSocket): Effect.Effect<CID> =>
    this.clients.pipe(
      ref => Tuple.make(ref, uuid.v4()),
      ([ref, id]) => Effect.zipRight(
        Ref.update(ref, HashMap.set(id, ws)),
        Effect.succeed(id),
      ),
    );
  public readonly forEach = (fn: (
    ws: WebSocket,
    id: CID,
  ) => void): Effect.Effect<void> =>
    this.clients.pipe(
      Ref.get,
      Effect.andThen(HashMap.forEach(fn)),
    );
  public readonly remove = (cid: CID): Effect.Effect<void> => {
    const x = this.clients.pipe(
      Ref.update(x => HashMap.remove(cid)(x)),
      x => x,
    );
    return x;
  };

  constructor(private clients: Ref.Ref<
    HashMap.HashMap<CID, WebSocket>
  >) {}

  public get size(): Effect.Effect<number> {
    return this.clients.pipe(
      Ref.get,
      Effect.andThen(HashMap.size),
    );
  }

  public get allIds(): Effect.Effect<Iterable<CID>> {
    return this.clients.pipe(
      Ref.get,
      Effect.andThen(HashMap.keys),
    );
  }
}

export class ConnectionRegistry extends Context.Tag("ConnectionRegistry")<
  ConnectionRegistry, ConnectionMapRegistry
>() {
  public static live = Layer.effect(
    ConnectionRegistry,
    Ref.make(HashMap.empty<CID, WebSocket>()).pipe(
      Effect.map(ref => new ConnectionMapRegistry(ref)),
    ),
  );
}
