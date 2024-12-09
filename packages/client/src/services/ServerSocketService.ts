import { wsUrl } from "@config";
import { NetAddress } from "@lib/net_address.ts";
import { AppRuntime } from "@lib/runtime.ts";
import { EventMessage, Socket, SocketEvent } from "@lib/socket.ts";
import { pipe } from "effect";
import * as Data from "effect/Data";
import * as Effect from "effect/Effect";
import * as Match from "effect/Match";
import * as O from "effect/Option";
import * as Queue from "effect/Queue";
import * as Stream from "effect/Stream";

const tag = "@my/client/services/ServerSocketService";
const tagFor = (subTag: string) => tag + "/" + subTag;

interface WithSocketCause {
  cause: Error;
  message: string;
}

export class CannotCreate extends Data.TaggedError(tagFor("CannotCreate"))<
  WithSocketCause
> {
  public static make = (cause: Error): CannotCreate =>
    new CannotCreate({ cause, message: `${cause}` });
}

export class CannotDestroy extends Data.TaggedError(tagFor("CannotDestroy"))<
  WithSocketCause
> {
  public static make = (cause: Error): CannotDestroy =>
    new CannotDestroy({ cause, message: `${cause}` });
}

export class CannotSend extends Data.TaggedError(tagFor("CannotSend"))<
  WithSocketCause
> {
  public static make = (cause: Error): CannotSend =>
    new CannotSend({ cause, message: `${cause}` });
}

export class AlreadyConnected extends Data.TaggedError(tagFor("CannotSend")) {}

export type MessageStreamError =
  | AlreadyConnected
  | CannotSend
  | CannotDestroy
  | CannotCreate;

export interface ServerSocket {
  create: (token: string) => Effect.Effect<void, MessageStreamError>;
  send: (message: string) => Effect.Effect<void, MessageStreamError>;
  messages: () => Stream.Stream<string>;
  destroy: () => Effect.Effect<void, MessageStreamError>;
}

class ServerSocketImpl implements ServerSocket {
  private socket: O.Option<Socket> = O.none();

  constructor(
    private readonly address: NetAddress,
    private readonly incoming: Queue.Queue<string>,
  ) {}

  private dispatch = (e: SocketEvent) => {
    Match.value<SocketEvent>(e).pipe(
      Match.tag("EventMessage", e => {
        return this.incoming.pipe(
          Queue.offer(e.message),
        );
      }),
      Match.orElse(e => {
        return this.destroy().pipe(
          Effect.zipLeft(
            Effect.logDebug(`Closing: ${e._tag}`),
          ),
        );
      }),
    ).pipe(
      Effect.annotateLogs(tag, "dispatch"),
      AppRuntime.runFork,
    );
  };

  /**
   * Create a socket connection to the server with JQT token as
   * parameter. If there is the connection
   * already, it'll be dropped and recreated.
   *
   * @param token JWT Token
   */

  public readonly create = (token: string): Effect.Effect<void, MessageStreamError> => {
    const disconnect = this.socket.pipe(
      Effect.flatMap(s => s.disconnect()),
      Effect.andThen(_ => this.socket = O.none()),
      Effect.ignore,
    );

    const connect = this.address.addQueryParam("token", token).pipe(
      Effect.flatMap(address => Socket.connect(address.mkString)),
      Effect.andThen(socket => {
        socket.watch(this.dispatch);
        this.socket = O.some(socket);
      }),
      Effect.catchAll(CannotCreate.make),
      Effect.asVoid,
    );

    return pipe(
      disconnect,
      Effect.andThen(_ => connect),
    );
  };

  public readonly send = (message: string): Effect.Effect<void, MessageStreamError> => {
    return this.socket.pipe(
      Effect.flatMap(s => s.send(message)),
      Effect.catchAll(CannotSend.make),
    );
  };

  public readonly messages = () => {
    return this.incoming.pipe(
      Queue.take,
      Effect.tap(s => console.log("take >>>>", s)),
      Stream.forever,
    );
  };

  public readonly destroy = () =>
    this.socket.pipe(
      Effect.flatMap(s => s.disconnect()),
      Effect.catchAll(CannotDestroy.make),
    );
}

export class ServerSocketService extends Effect.Tag(tag.toString())<
  ServerSocketService, ServerSocket
>() {
  public static service = wsUrl.pipe(
    Effect.andThen(NetAddress.make),
    Effect.andThen(address => Queue.unbounded<string>().pipe(
        Effect.andThen(incoming => new ServerSocketImpl(
          address,
          incoming,
        )),
      ),
    ),
  );
}
