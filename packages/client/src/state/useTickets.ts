import { AppRuntime } from "@lib/runtime.ts";
import { filterTicketsByStatus } from "@lib/ticket_filtering.ts";
import { Ticket } from "@my/domain/model";
import { TicketStoreService } from "@store";
import { Fiber, flow, identity } from "effect";
import * as Data from "effect/Data";

import * as Effect from "effect/Effect";
import * as O from "effect/Option";
import * as Stream from "effect/Stream";
import { useEffect, useState } from "react";


class TicketError extends Data.Error<{
  message: string;
  ticket: Ticket;
}> {};

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

  const lockTicket = (t: Ticket): Promise<TicketError | void> => {
    return Promise.resolve(console.log(">>>> Log ticket", t));
  };

  const unlockTicket = (t: Ticket): Promise<TicketError | void> => {
    return Promise.resolve(console.log(">>>> Unlock ticket", t));
  };

  const saveTicket = (t: Ticket): Promise<TicketError | void> => {
    return Promise.resolve(console.log(">>>> Save ticket", t));
  };
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
    const fiber = AppRuntime.runFork(watchTickets);
    return () => {
      void AppRuntime.runPromise(Fiber.interruptFork(fiber));
    };
  }, []);

  return {
    lockTicket,
    saveTicket,
    setStatusFilter,
    tickets: maybeFilterBy(statusFilter)(tickets),
    unlockTicket,
  };
};
