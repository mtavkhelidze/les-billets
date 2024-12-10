import * as Data from "effect/Data";
import * as Effect from "effect/Effect";
import { constVoid } from "effect/Function";

export class SocketError extends Data.Error<{
  cause: Error;
  message: string;
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
  readonly send: (message: string) => Effect.Effect<void, SocketError>;
  readonly shutdown: () => Effect.Effect<void, SocketError>;
  readonly watch: (watcher: EventWatcher) => void;
}

const failWithError = (error: unknown) => {
  return new SocketError({
    message: `Cannot send: ${error}}`,
    cause: error as Error,
  });
};

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
        void emit(failWithError(error));
      }
    });

  public watch = (watcher: EventWatcher): void => {
    this.ws.onmessage = event => {
      watcher(EventMessage({ message: `${event.data}` }));
    };
    this.ws.onclose = () => {
      watcher(EventClose());
    };
    this.ws.onerror = error => {
      watcher(EventError({ message: `${error}` }));
    };
  };

  public readonly send = (message: string): Effect.Effect<void, SocketError> => {
    return Effect.try({
      try: () => this.ws.send(message),
      catch: failWithError,
    });
  };

  public readonly shutdown = (): Effect.Effect<void, SocketError> => {
    return Effect.try({
      try: () => {
        this.ws.onopen = null;
        this.ws.onerror = null;
        this.ws.onmessage = null;
        this.ws.close();
        return constVoid();
      },
      catch: failWithError,
    });
  };
}
