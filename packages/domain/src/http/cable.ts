import * as S from "effect/Schema";
import { Ticket } from "../model";
import { TicketStatus } from "../model/Ticket.ts";
import { UserID } from "../model/UserProfile.ts";

// region ServerCable
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
// endregion

// region ClientCable

export class GetTicketList extends S.TaggedClass<GetTicketList>(
  "@my/domain/cable/GetTicketList",
)(
  "GetTicketList",
  {},
) {}

export const ClientCable = S.Union(
  GetTicketList,
);
export type ClientCable = S.Schema.Type<typeof ClientCable>;

// endregion
