import { AppRuntime } from "@lib/runtime.ts";
import { filterTicketsByStatus } from "@lib/ticket_filtering.ts";
import { Ticket } from "@my/domain/model";
import { TicketStoreService } from "@store";
import { flow, identity } from "effect";

import * as Effect from "effect/Effect";
import * as O from "effect/Option";
import * as Stream from "effect/Stream";
import { useEffect, useState } from "react";

// @misha: again, excessive vanity...

type FilterFunction = (_: readonly Ticket[]) => readonly Ticket[];
const doNotFilter: FilterFunction = identity;

const maybeFilterBy = O.match<FilterFunction, Ticket["status"]>({
  onNone: () => doNotFilter,
  onSome: filterTicketsByStatus,
});

export const useTickets = () => {
  const [tickets, setTickets] = useState<readonly Ticket[]>([]);
  const [statusFilter, setStatusFilter] = useState<O.Option<Ticket["status"]>>(O.none());

  const watchTickets =
    TicketStoreService.stream().pipe(
      Effect.andThen(
        Stream.runForEach(
          flow(
            setTickets,
            Effect.succeed,
          ),
        ),
      ),
    );

  useEffect(() => {
    void AppRuntime.runFork(watchTickets);
  }, []);

  return {
    tickets: maybeFilterBy(statusFilter)(tickets),
    setStatusFilter,
  };
};
