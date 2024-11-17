import * as S from "effect/Schema";
import { Ticket } from "../model";

export class GetTickets extends S.TaggedClass<GetTickets>()(
  "GetTickets", {},
) {}

export const ClientMessage = S.Union(
  GetTickets,
);
export type ClientMessage = S.Schema.Type<typeof ClientMessage>

export class AllTickets extends S.TaggedClass<AllTickets>()(
  "AllTickets", {
    tickets: S.Array(Ticket),
  },
) {}

export const ServerMessage = S.Union(
  AllTickets,
);
export type ServerMessage = S.Schema.Type<typeof ServerMessage>
