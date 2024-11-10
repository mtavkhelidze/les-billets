import * as S from "effect/Schema";
import { Ticket } from "./Ticket.ts";

export class AllTickets extends S.TaggedClass<AllTickets>()(
  "AllTickets", {
    tickets: S.Array(Ticket),
  },
) {}

export const ServerMessage = S.Union(
  AllTickets,
);

export type ServerMessage = S.Schema.Type<typeof ServerMessage>
