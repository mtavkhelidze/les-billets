import { ErrorShape } from "@my/domain/model/utility";
import { WebSuckerSocket } from "@services/WebSuckerSocket.ts";
import { identity, Layer } from "effect";
import * as Effect from "effect/Effect";
import * as O from "effect/Option";
import * as Queue from "effect/Queue";
import * as Schema from "effect/Schema";

const Id: unique symbol =
  Symbol.for("@my/client/services/WebSucker");

const id = Id.toString();

export class CannotCreate extends Schema.TaggedError<
  CannotCreate>(`${id}/CannotCreate`)(
  "CannotCreate",
  ErrorShape,
) {}

export const WebSuckerError = Schema.Union(
  CannotCreate,
);
export type WebSuckerError = Schema.Schema.Type<typeof WebSuckerError>;

interface WebSucker {
  send: (message: string) => Effect.Effect<void>;
  messages: (reader: (_: string) => void) => Effect.Effect<void>;
}

class WebSuckerImpl implements WebSucker {
  private static instance: O.Option<WebSuckerImpl> = O.none();

  public static create = (
    socket: WebSocket,
    inc: Queue.Queue<string>,
    out: Queue.Queue<string>,
  ): WebSuckerImpl => {
    return O.match(WebSuckerImpl.instance, {
      onSome: identity,
      onNone: () => {
        const wsi = new WebSuckerImpl(socket, inc, out);
        WebSuckerImpl.instance = O.some(wsi);
        return wsi;
      },
    });
  };

  private constructor(
    private readonly socket: WebSocket,
    private readonly incoming: Queue.Queue<string>,
    private readonly outgoing: Queue.Queue<string>,
  ) {
    console.count(">>> Constructor");
  }

  public send = (message: string): Effect.Effect<void> => {
    console.log("sending >>>>", message);
    return Queue.offer(this.outgoing, message);
  };

  public messages = (reader: (_: string) => void) => {
    return Queue.take(this.outgoing).pipe(
      Effect.tap(console.log),
      Effect.andThen(x => reader(x)),
      Effect.forever,
    );
  };
}

export class WebSuckerClient extends Effect.Tag(id)<
  WebSuckerClient, WebSucker
>() {
  public static live = Layer.effect(
    WebSuckerClient,
    WebSuckerSocket.open("ws://localhost:8081").pipe(
      Effect.tap(console.log),
      Effect.andThen(ws => Effect.all([
          Queue.unbounded<string>(),
          Queue.unbounded<string>(),
        ]).pipe(
          Effect.andThen(([i, o]) => WebSuckerImpl.create(ws, i, o)),
        ),
      ),
    ).pipe(
      Effect.provideService(WebSuckerSocket, WebSuckerSocket.live),
    ),
  );
}
