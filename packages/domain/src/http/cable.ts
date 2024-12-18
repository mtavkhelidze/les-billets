import * as S from "effect/Schema";
import { Ticket, UserID } from "../model";
import { TicketStatus } from "../model/Ticket.ts";

// region ServerCable
export class TicketList extends S.TaggedClass<TicketList>(
  "server/TicketList",
)(
  "TicketList",
  {
    tickets: S.Array(Ticket),
  },
) {}

export class TicketStatusUpdate extends S.TaggedClass<TicketStatusUpdate>(
  "server/TicketStatusUpdate",
)(
  "TicketStatusUpdate",
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
// endregion

// region ClientCable

export class GetTicketList extends S.TaggedClass<GetTicketList>(
  "client/GetTicketList",
)(
  "GetTicketList",
  {},
) {}

export const ClientCable = S.Union(
  GetTicketList,
);
export type ClientCable = S.Schema.Type<typeof ClientCable>;

// endregion
