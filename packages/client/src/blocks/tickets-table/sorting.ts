import { flow } from "effect";
import * as Array from "effect/Array";
import * as Order from "effect/Order";

import { Ticket } from "../../../../domain";

type SortOrder = "asc" | "desc" | "none";

export const sortByAsc = Array.sortBy<readonly Ticket[]>;

export const sortDescBy = flow(
  (...orders: Order.Order<Ticket>[]) => orders.map(Order.reverse),
  os => Array.sortBy<readonly Ticket[]>(...os),
);
export const byId = Order.mapInput(
  Order.string,
  (Ticket: Ticket) => Ticket.id,
);

export const byTitle = Order.mapInput(
  Order.string,
  (ticket: Ticket) => ticket.title,
);

export const byStatus = Order.mapInput(
  Order.string,
  (ticket: Ticket) => ticket.status,
);

