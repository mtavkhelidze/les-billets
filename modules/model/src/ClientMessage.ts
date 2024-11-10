import * as S from "effect/Schema";
import { Ticket } from "./Ticket.ts";

export class GetTickets extends S.TaggedClass<GetTickets>()(
  "GetTickets",
  {},
) {}

export class LockTicket extends S.TaggedClass<LockTicket>()(
  "LockTicket",
  { ticketId: S.UUID },
) {}

export class UnlockTicket extends S.TaggedClass<UnlockTicket>()(
  "UnlockTicket",
  { ticketId: S.UUID },
) {}

export class UpdateTicket extends S.TaggedClass<UpdateTicket>()(
  "UpdateTicket",
  {
    ticketId: Ticket,
  },
) {}

export const ClientMessage = S.Union(
  GetTickets,
  LockTicket,
  UnlockTicket,
  UpdateTicket,
);
export type ClientMessage = S.Schema.Type<typeof ClientMessage>

