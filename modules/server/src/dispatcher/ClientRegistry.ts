import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as  List from "effect/List";
import * as SynchronizedRef from "effect/SynchronizedRef";
import type { WebSocketConnection } from "../services/ConnectionsStream.ts";


class ClientSyncRegistry {
  constructor(private clients: SynchronizedRef.SynchronizedRef<List.List<WebSocketConnection>>) {}

  public get all(): Effect.Effect<List.List<WebSocketConnection>> {
    return this.clients.pipe(
      SynchronizedRef.get,
    );
  }

  public readonly add = (wsc: WebSocketConnection): Effect.Effect<number> =>
    this.clients.pipe(
      SynchronizedRef.updateAndGet(List.append(wsc)),
      Effect.map(List.size),
    );

  public readonly forEach = (fn: (wsc: WebSocketConnection) => void): Effect.Effect<void> =>
    this.clients.pipe(
      SynchronizedRef.get,
      Effect.andThen(List.forEach(fn)),
    );

  public readonly remove = (wsc: WebSocketConnection): Effect.Effect<number> =>
    this.clients.pipe(
      SynchronizedRef.updateAndGet(List.filter(x => x.id !== wsc.id)),
      Effect.map(List.size),
    );
}

export class ClientRegistry extends Context.Tag("ClientRegistry")<
  ClientRegistry, ClientSyncRegistry
>() {
  public static live = new ClientSyncRegistry(
    SynchronizedRef.unsafeMake(List.empty<WebSocketConnection>()),
  );
}
