import * as Effect from "effect/Effect";
import type { ParseError } from "effect/ParseResult";
import * as Schema from "effect/Schema";
import * as S from "effect/Schema";
import { ModelError } from "./index.ts";

export class Ticket extends S.TaggedClass<Ticket>()("Ticket", {
    createdAt: S.Number,
    createdBy: S.UUID,
    description: S.String,
    id: S.UUID,
    status: S.Literal("closed", "locked", "open"),
    title: S.String,
    updatedAt: S.NullOr(S.Number),
    updatedBy: S.NullOr(S.UUID),
  },
) {
  public static fromJson = (json: string): Effect.Effect<Ticket, ModelError> =>
    Effect.try({
      try: () =>
        Schema.decodeUnknownSync(Schema.parseJson(Ticket))(json),
      catch: (e) => new ModelError({ error: e as ParseError }),
    });
  public static fromJsonArray =
    Schema.decodeUnknownSync(Schema.parseJson(Ticket.pipe(S.Array)));
}
