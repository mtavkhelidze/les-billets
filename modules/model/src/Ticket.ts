import * as S from "effect/Schema";

export class Ticket extends S.TaggedClass<Ticket>()("Ticket", {
    createdAt: S.Number,
    createdBy: S.UUID,
    description: S.String,
    id: S.UUID,
    status: S.Literal("closed", "locked", "open"),
    title: S.String,
    updatedAt: S.Option(S.Number),
    updatedBy: S.Option(S.UUID),
  },
) {}
