import { DateTime, pipe } from "effect";
import * as Effect from "effect/Effect";
import * as O from "effect/Option";
import type { ParseError } from "effect/ParseResult";
import * as Schema from "effect/Schema";
import { ClientMessage } from "./ClientMessage.ts";
import { ModelError } from "./index.ts";
import { ServerMessage } from "./ServerMessage.ts";

export const clientMessageFromJson = (msg: string): Effect.Effect<ClientMessage, ModelError> => Effect.try(
  {
    try: () => Schema.decodeUnknownSync(Schema.parseJson(ClientMessage))(msg),
    catch: (e) => new ModelError({ error: e as ParseError }),
  });

export const serverMessageToJson: (_: ServerMessage) => Effect.Effect<string, ModelError> =
  pipe(
    Schema.parseJson(ServerMessage),
    schema => message => Schema.encode(schema)(message)
      .pipe(Effect.mapError(e => new ModelError({ error: e }))),
  );

export const stringToUtc = (s: string | null) => pipe(
  O.fromNullable(s),
  O.flatMap(DateTime.make),
  O.map(x => x.epochMillis),
);
