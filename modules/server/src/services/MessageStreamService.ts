import * as Chunk from "effect/Chunk";
import * as Context from "effect/Context";
import * as Data from "effect/Data";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as O from "effect/Option";
import * as Stream from "effect/Stream";
import type { RawData } from "ws";
import type { WebSocketConnection } from "./ConnectionsStream.ts";

class MessageStreamError extends Data.TaggedError("MessageStreamError")<{
  error: Error
}> {
}

export class RawDataDecodeError
  extends Data.TaggedError("RowDataDecodeError")<{
    error: unknown
  }> {
}

const rawDataToString = (rd: RawData): Effect.Effect<string, RawDataDecodeError> =>
  Effect.try<string, RawDataDecodeError>({
    try: () => {
      if (rd instanceof Buffer) {
        return rd.toString();
      }
      if (rd instanceof ArrayBuffer) {
        return Buffer.from(rd).toString();
      }
      if (Array.isArray(rd)) {
        // @misha: don't like that
        return rd.map(d => rawDataToString(d)).join(" ");
      }
      throw new Error("Cannot read message data");
    },
    catch: (error: unknown) => new RawDataDecodeError({ error }),
  }).pipe(
    Effect.andThen(s => s),
  );

const createStringStream = (wsc: WebSocketConnection): Stream.Stream<string, MessageStreamError> => {
  return Stream.async(emit => {
    wsc.ws.on("message", (data: RawData) => {
      void emit(
        rawDataToString(data).pipe(
          Effect.map(s => Chunk.of(s)),
          Effect.catchAll(error => Effect.fail(O.some(new MessageStreamError({ error })))),
        ),
      );
    });
    wsc.ws.on("error", error => {
      void emit(Effect.fail(O.some(new MessageStreamError({ error }))));
    });
    wsc.ws.on("close", () => {
      void emit(
        Effect.zipRight(
          Effect.logDebug(`${wsc.id} message stream closed`),
          Effect.fail(O.none()),
        ));
    });
  });
};

export class MessageStreamService
  extends Context.Tag("MessageStreamService")<
    MessageStreamService,
    {
      create: (ws: WebSocketConnection) => Stream.Stream<string, MessageStreamError>
    }
  >() {
  public static live = Layer.succeed(
    MessageStreamService,
    MessageStreamService.of({
      create: createStringStream,
    }),
  );
}
