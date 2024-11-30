import { DateTime, pipe } from "effect";
import * as Effect from "effect/Effect";
import * as O from "effect/Option";
import type { ParseError } from "effect/ParseResult";
import * as S from "effect/Schema";
import { ClientCable } from "../http";

export class JsonDecodeError extends S.TaggedError<JsonDecodeError>()(
  "JsonDecodeError", { message: S.String },
) {}

// @misha: there must ba a better place for his stuff
export const clientCableFromJson = (msg: string): Effect.Effect<ClientCable, JsonDecodeError> =>
  Effect.try({
    try: () =>
      S.decodeUnknownSync(S.parseJson(ClientCable))(msg),
    catch: (e) => new JsonDecodeError({
      message: (
        e as ParseError
      ).toString(),
    }),
  });

// export const serverMessageToJson: (_: ServerMessage) =>
// Effect.Effect<string, ModelError> = pipe(Schema.parseJson(ServerMessage),
// schema => message => Schema.encode(schema)(message).pipe(Effect.mapError(e
// => new ModelError({ error: e, }))));

export const stringToUtc = (s: string | null) => pipe(
  O.fromNullable(s),
  O.flatMap(DateTime.make),
  O.map(x => x.epochMillis),
);
