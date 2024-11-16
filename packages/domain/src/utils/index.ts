import { DateTime, pipe } from "effect";
import * as O from "effect/Option";
//
// export class JsonDecodeError extends Schema.TaggedClass("JsonDecodeError")<{
//   "JsonDecodeError": { error: ParseError };
// }>(){}
//
// export const clientMessageFromJson = (msg: string):
// Effect.Effect<ClientMessage, ModelError> => Effect.try( { try: () =>
// Schema.decodeUnknownSync(Schema.parseJson(ClientMessage))(msg), catch: (e)
// => new ModelError({ error: e as ParseError }), });  export const
// serverMessageToJson: (_: ServerMessage) => Effect.Effect<string, ModelError>
// = pipe( Schema.parseJson(ServerMessage), schema => message =>
// Schema.encode(schema)(message) .pipe(Effect.mapError(e => new ModelError({
// error: e }))), );

export const stringToUtc = (s: string | null) => pipe(
  O.fromNullable(s),
  O.flatMap(DateTime.make),
  O.map(x => x.epochMillis),
);
