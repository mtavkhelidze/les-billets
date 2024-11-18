import * as S from "effect/Schema";
import { Ticket } from "../model";
import { TicketStatus } from "../model/Ticket.ts";
import { UserID } from "../model/UserProfile.ts";

export class TicketList extends S.Class<TicketList>(
  "@my/domain/cable/TicketList",
)(
  {
    tickets: S.Array(Ticket),
  },
) {}

export class TicketStatusUpdate extends S.Class<TicketStatusUpdate>(
  "@my/domain/cable/TicketStatusUpdate",
)(
  {
    status: TicketStatus,
    ticketId: S.Array(S.UUID),
    updatedAt: S.Number,
    updatedBy: UserID,
  },
) {}

export const ServerCable = S.Union(
  TicketList,
  TicketStatusUpdate,
);
export type ServerCable = S.Schema.Type<typeof ServerCable>;
