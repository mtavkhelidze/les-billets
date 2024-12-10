import { AppRuntime } from "@lib/runtime.ts";
import { EventMessage, Socket, SocketError } from "@lib/socket.ts";
import { Layer, pipe } from "effect";
import * as Data from "effect/Data";
import * as Effect from "effect/Effect";
import * as Queue from "effect/Queue";
import * as Stream from "effect/Stream";

const tag = Symbol.for("@my/client/services/WebSucker").toString();
const tagFor = (subTag: string) => tag + "/" + subTag;

interface WithSocketCause {
  cause: SocketError;
}

export class CannotConnect extends Data.TaggedError(tagFor("CannotConnect"))<
  WithSocketCause
> {}

export class CannotClose extends Data.TaggedError(tagFor("CannotClose"))<
  WithSocketCause
> {}

export class CannotSend extends Data.TaggedError(tagFor("CannotSend"))<
  WithSocketCause
> {}

export type WebSuckerError = CannotConnect | CannotSend | CannotClose;

interface WebSucker {
  send: (message: string) => Effect.Effect<void, WebSuckerError>;
  messages: () => Stream.Stream<string>;
  close: () => Effect.Effect<void, WebSuckerError>;
}

class WebSuckerImpl implements WebSucker {
  constructor(
    private readonly socket: Socket,
    private readonly incoming: Queue.Queue<string>,
  ) {
    this.socket.watch(e => {
      switch (e._tag) {
        case "EventMessage":
          this.incoming.pipe(
            Queue.offer(e.message),
            AppRuntime.runFork,
          );
          break;
        case "EventClose":
        case "EventError":
          this.close().pipe(
            AppRuntime.runFork,
          );
          break;
      }
    });
  }

  public readonly send = (message: string): Effect.Effect<void, WebSuckerError> => {
    return this.socket.send(message).pipe(
      Effect.catchAll(cause => new CannotSend({ cause })),
    );
  };

  public readonly messages = () => {
    return this.incoming.pipe(
      Queue.take,
      Effect.tap(s => console.log("take >>>>", s)),
      Stream.forever,
    );
  };

  public readonly close = () =>
    this.socket.shutdown().pipe(
      Effect.catchAll(cause => new CannotSend({ cause })),
    );
}

export class WebSuckerClient extends Effect.Tag(tag)<
  WebSuckerClient, WebSucker
>() {
  public static live = Layer.effect(
    WebSuckerClient,
    // @misha: each sucker get its own socket it has to shutdown.
    Socket.open("ws://localhost:8081").pipe(
      Effect.flatMap(
        socket => pipe(
          Queue.unbounded<string>(),
          Effect.map(incoming => new WebSuckerImpl(socket, incoming)),
        ),
      ),
    ),
  );
}
