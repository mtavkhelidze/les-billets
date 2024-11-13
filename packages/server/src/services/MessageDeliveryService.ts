import * as Context from "effect/Context";
import * as Data from "effect/Data";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";

class MessageDeliveryError
  extends Data.TaggedError("MessageDeliveryError")<{}> {}

interface MessageDelivery {
  readonly sendData: (socket: WebSocket) => (data: string) => Effect.Effect<void, MessageDeliveryError>;
  readonly sendPing: (socket: WebSocket) => Effect.Effect<void, MessageDeliveryError>;
}

class SocketMessageDelivery implements MessageDelivery {
  readonly sendData = (socket: WebSocket) => (data: string) => {
    return Effect.try({
      try: () => socket.send(data),
      catch: () => new MessageDeliveryError(),
    });
  };

  /**
   * Ping client mainly to see if the connection is still alive.
   *
   * Data can be anything and the client must send back pong with
   * exactly the same data payload. Here we just don't care about that.
   *
   * For mask (undefined) read: https://bit.ly/4erIEp4
   */
  readonly sendPing = (socket: WebSocket) =>
    Effect.async<void, MessageDeliveryError>(resume => {
      socket.ping("0xDEADBEEF", undefined, error =>
        !!error
          ? resume(Effect.fail(new MessageDeliveryError()))
          : resume(Effect.void),
      );
    });
}

export class MessageDeliveryService
  extends Context.Tag("MessageDeliveryService")<
    MessageDeliveryService, MessageDelivery
  >() {
  public static live = Layer.succeed(
    MessageDeliveryService,
    new SocketMessageDelivery(),
  );
}
