import * as S from "effect/Schema";

export class GetTickets extends S.TaggedClass<GetTickets>()(
  "GetTickets", {},
) {}

export class LockTicket extends S.TaggedClass<LockTicket>()("LockTicket", {
    ticketId: S.Positive,
  },
) {}

export class UpdateTicket extends S.TaggedClass<UpdateTicket>()(
  "UpdateTicket",
  {
    ticketId: S.Positive,
  },
) {}

export const ClientMessage = S.Union(
  GetTickets,
  LockTicket,
  UpdateTicket,
);
export type ClientMessage = S.Schema.Type<typeof ClientMessage>

