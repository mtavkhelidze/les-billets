import * as Context from "effect/Context";

export const WebSocketServerTypeId: unique symbol =
  Symbol.for("@my/services/WebSocketServer");
export type WebSocketServerTypeId = typeof WebSocketServerTypeId

export const SocketServer: Context.Tag<SocketServer, SocketServer> =
  Context.GenericTag<SocketServer>(
    "@my/services/SocketServer",
  );

export interface SocketServer {
  readonly [WebSocketServerTypeId]: WebSocketServerTypeId;
  readonly address: Address;
  readonly run: <R, E, _>(
    handler: (socket: Socket.Socket) => Effect.Effect<_, E, R>,
  ) => Effect.Effect<never, SocketServerError, R>;
}
