import { Ticket } from "@my/domain/model";
import * as A from "effect/Array";
import { dual } from "effect/Function";

export const filterTicketsByStatus: {
  (tickets: readonly Ticket[], status: Ticket["status"]): readonly Ticket[],
  (status: Ticket["status"]): (tickets: readonly Ticket[]) => readonly Ticket[],
} = dual(
  2,
  (tickets: readonly Ticket[], status: Ticket["status"]): readonly Ticket[] =>
    A.filter(tickets, t => t.status === status),
);
