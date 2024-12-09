import * as Data from "effect/Data";
import * as Effect from "effect/Effect";
import { constVoid } from "effect/Function";

const id = "@my/client/misha";
type id = typeof id;

export class SocketError extends Data.TaggedError(`${id}/SocketError`)<{
  message: string;
  cause: Error;
}> {}

export interface EventMessage {
  readonly _tag: "EventMessage";
  readonly message: string;
}

export interface EventClose {
  readonly _tag: "EventClose";
}

export interface EventError {
  readonly _tag: "EventError";
  message: string;
}

export const EventMessage = Data.tagged<EventMessage>("EventMessage");
export const EventClose = Data.tagged<EventClose>("EventClose");
export const EventError = Data.tagged<EventError>("EventError");

export type StreamEvent = EventMessage | EventClose | EventError

type EventWatcher = (event: StreamEvent) => void;

export interface SocketOperations {
  readonly close: () => Effect.Effect<void, SocketError>;
  readonly send: (message: string) => Effect.Effect<void, SocketError>;
  readonly watch: (watcher: EventWatcher) => void;
}

export class Socket implements SocketOperations {
  private constructor(private readonly ws: WebSocket) {}

  public static open = (url: string): Effect.Effect<Socket, SocketError> =>
    Effect.async<Socket, SocketError>(emit => {
      try {
        const ws = new WebSocket(url);
        ws.onopen = () => {
          void emit(Effect.succeed(new Socket(ws)));
        };
      } catch (error) {
        void emit(new SocketError({
            message: "Cannot open socket",
            cause: error as Error,
          }),
        );
      }
    });

  public watch = (watcher: EventWatcher): void => {
    this.ws.onmessage = event => {
      watcher(EventMessage({ message: `${event.data}` }));
    }
    this.ws.onclose = () => {
      watcher(EventClose());
    }
    this.ws.onerror = error => {
      watcher(EventError({ message: `${error}` }));
    }

  };

  public readonly send = (message: string): Effect.Effect<void, SocketError> => {
    return Effect.try({
      try: () => this.ws.send(message),
      catch: (error) => {
        return new SocketError({
          message: `Cannot send: ${error}}`,
          cause: error as Error,
        });
      },
    });
  };

  public readonly close = (): Effect.Effect<void, SocketError> => {
    return Effect.try({
      try: () => {
        this.ws.onopen = null;
        this.ws.onerror = null;
        this.ws.onmessage = null;
        this.ws.close();
        this.ws.terminate();
        return constVoid();
      },
      catch: (error) => {
        return new SocketError({
          message: `Cannot create socket: ${error}`,
          cause: error as Error,
        });
      },
    });
  };
}
