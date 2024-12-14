import { AppRuntime } from "@lib/runtime.ts";
import { Ticket } from "@my/domain/model";
import { TicketStoreService } from "@store";

import * as Effect from "effect/Effect";
import * as Stream from "effect/Stream";
import { useEffect, useState } from "react";

export const useTickets = () => {
  const [tickets, setTickets] = useState<readonly Ticket[]>([]);

  const watchTickets =
    TicketStoreService.stream().pipe(
      Effect.andThen(
        Stream.runForEach(tickets =>
          Effect.succeed(setTickets(tickets),
          ),
        ),
      ),
    );

  useEffect(() => {
    void AppRuntime.runFork(watchTickets);
  });

  return {
    tickets,
  };
};
