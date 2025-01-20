import { useTickets } from "@state";

import { TicketsTable } from "./TicketsTable.tsx";

export const Tickets = () => {
  const { tickets, setStatusFilter } = useTickets();

  return (
    <TicketsTable tickets={tickets} />
  );
};
