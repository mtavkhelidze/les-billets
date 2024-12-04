import * as S from "effect/Schema";
import { UserID } from "./SystemUser.ts";

export const TicketStatus = S.Literal("closed", "locked", "open");
export type TicketStatus = S.Schema.Type<typeof TicketStatus>;

export const TicketID = S.UUID;
export type TicketID = S.Schema.Type<typeof TicketID>;

export class Ticket extends S.TaggedClass<Ticket>()(
  "@my/domain/model/Ticket",
  {
    createdAt: S.DateTimeUtc,
    createdBy: UserID,
    description: S.String,
    id: TicketID,
    status: TicketStatus,
    title: S.String,
    updatedAt: S.DateTimeUtc,
    updatedBy: UserID.pipe(S.Option),
  },
) {}
