import { API } from "@api";
import { InternalServerError } from "@api/error";
import { TickersResponse } from "@domain/model/http";
import { HttpApiBuilder } from "@effect/platform";
import { DatabaseDriver, TicketStorage } from "@storage";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import { AuthUserId } from "./middleware/authentication.ts";

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
  API,
  "tickets",
  handlers => handlers
    .handle("getAll", getAllTickets),
)
