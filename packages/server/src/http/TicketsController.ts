import { HttpApiBuilder } from "@effect/platform";
import { AuthUserId, LesBilletsAPI } from "@my/domain/api";
import { TickersResponse } from "@my/domain/http";
import { InternalServerError } from "@my/domain/http/errors";
import { TicketStorage } from "@storage";
import * as Effect from "effect/Effect";

const getAllTickets = () =>
  AuthUserId.pipe(
    Effect.flatMap(userId => {
        console.log(userId);
        return TicketStorage.pipe(
          Effect.andThen(ts => ts.getTickets()),
          Effect.map(tickets => new TickersResponse({ tickets })),
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
