import { HttpApiBuilder } from "@effect/platform";
import { AuthUserId, LesBilletsAPI } from "@my/domain/api";
import { TicketsResponse } from "@my/domain/http";
import { InternalServerError } from "@my/domain/http/errors";
import { TicketStorageService } from "@storage";
import * as Effect from "effect/Effect";

const getAllTickets = () =>
  AuthUserId.pipe(
    Effect.flatMap(userId => {
        return TicketStorageService.pipe(
          Effect.andThen(ts => ts.getTickets()),
          Effect.map(tickets => new TicketsResponse({ tickets })),
          Effect.mapError(e => new InternalServerError()),
        );
      },
    ),
  );

export const TicketController = HttpApiBuilder.group(
  LesBilletsAPI,
  "tickets",
  handlers => handlers
    .handle("getAll", getAllTickets),
);
