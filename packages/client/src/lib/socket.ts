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

export type SocketEvent = EventMessage | EventClose | EventError

type EventWatcher = (event: SocketEvent) => void;

export interface SocketOperations {
  readonly send: (message: string) => Effect.Effect<void, SocketError>;
  readonly disconnect: () => Effect.Effect<void, SocketError>;
  readonly watch: (watcher: EventWatcher) => void;
}

const failWithError = (msg: string) => (error: unknown) => {
  return new SocketError({
    message: `${msg}: ${error}`,
    cause: error as Error,
  });
};

export class Socket implements SocketOperations {
  public static connect = (url: string): Effect.Effect<Socket, SocketError> =>
    Effect.async<Socket, SocketError>(emit => {
      try {
        const ws = new WebSocket(url);
        ws.onopen = () => {
          void emit(Effect.succeed(new Socket(ws)));
        };
        ws.onerror = e => {
          void emit(failWithError("Cannot connect")(Error("no connection")));
        };
      } catch (error) {
        void emit(failWithError("Invalid parameters")(error as DOMException));
      }
    });
  public readonly disconnect = (): Effect.Effect<void, SocketError> => {
    return Effect.try({
      try: () => {
        this.ws.onopen = null;
        this.ws.onerror = null;
        this.ws.onmessage = null;
        this.ws.close();
        return constVoid();
      },
      catch: failWithError("Error closing socket"),
    });
  };
  public readonly send = (message: string): Effect.Effect<void, SocketError> => {
    return Effect.try({
      try: () => this.ws.send(message),
      catch: failWithError("Cannot send message"),
    });
  };
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

  private constructor(private readonly ws: WebSocket) {}
}
