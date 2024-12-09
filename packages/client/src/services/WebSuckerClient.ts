import { AppRuntime } from "@lib/runtime.ts";
import { EventMessage, Socket, StreamEvent } from "@lib/socket.ts";
import { ErrorShape } from "@my/domain/model/utility";
import { flow, Layer, pipe } from "effect";
import * as Chunk from "effect/Chunk";
import * as Effect from "effect/Effect";
import * as Queue from "effect/Queue";
import * as Schema from "effect/Schema";
import * as Stream from "effect/Stream";
const Id = Symbol.for("@my/client/services/WebSucker");
const id = Id.toString();

export class CannotConnect extends Schema.TaggedError<
  CannotConnect
>(`${id}/CannotConnect`)(
  "CannotConnect",
  ErrorShape,
) {
}

export class CannotClose extends Schema.TaggedError<
  CannotClose
>(`${id}/CannotClose`)(
  "CannotClose",
  ErrorShape,
) {
}

export class CannotSend extends Schema.TaggedError<
  CannotSend
>(`${id}/CannotSend`)(
  "CannotConnect",
  ErrorShape,
) {}

export const WebSuckerError = Schema.Union(
  CannotConnect,
  CannotSend,
  CannotClose,
);
export type WebSuckerError = Schema.Schema.Type<typeof WebSuckerError>;

interface WebSucker {
  send: (message: string) => Effect.Effect<void, WebSuckerError>;
  messages: () => Stream.Stream<string>;
  close: () => Effect.Effect<void, WebSuckerError>;
}

const toChunk = flow(
  x => x as ArrayBuffer,
  new TextDecoder("utf-8").decode,
  x => Chunk.fromIterable([x]),
);

class WebSuckerImpl implements WebSucker {
  constructor(
    private readonly socket: Socket,
    private readonly incoming: Queue.Queue<StreamEvent>,
  ) {
    this.socket.watch(e => {
      console.log(e);
      switch (e._tag) {
        case "EventMessage":
          this.incoming.pipe(
            Queue.offer(e),
            AppRuntime.runFork,
          );
          break;
        case "EventClose":
        case "EventError":
          this.incoming.pipe(
            Queue.shutdown,
            Effect.andThen(Effect.logDebug("Shutting down...", e)),
            AppRuntime.runFork,
          );
          break;
      }
    });
  }

  public readonly send = (message: string): Effect.Effect<void, WebSuckerError> => {
    return this.socket.send(message).pipe(
      Effect.catchAll(e => new CannotSend({
          message: e.message,
          module: Id,
          cause: e,
        }),
      ),
    );
  };

  public readonly messages = () => {
    return this.incoming.pipe(
      Queue.take,
      Effect.tap(s => console.log("take >>>>", s)),
      Stream.map(x => x._tag),
      Stream.tapError(Effect.log),
      Stream.forever,
    );
  };

  public readonly close = () => this.socket.close().pipe(
    Effect.catchAll(e => new CannotSend({
        message: e.message,
        module: Id,
        cause: e,
      }),
    ),
  );
}

export class WebSuckerClient extends Effect.Tag(id)<
  WebSuckerClient, WebSucker
>() {
  public static live = Layer.effect(
    WebSuckerClient,
    // @misha: each sucker get its own socket it has to close.
    Socket.open("ws://localhost:8081").pipe(
      Effect.flatMap(
        socket => pipe(
          Queue.unbounded<StreamEvent>(),
          Effect.map(incoming => new WebSuckerImpl(socket, incoming)),
        ),
      ),
    ),
  );
}
