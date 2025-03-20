import { HttpApiBuilder } from "@effect/platform";
import { AuthUserId, LesBilletsAPI } from "@my/domain/api";
import { TicketsResponse } from "../../../domain/src/dto";
import { InternalServerError } from "@my/domain/dto";
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
