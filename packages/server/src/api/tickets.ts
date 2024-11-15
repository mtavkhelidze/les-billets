import { InternalServerError, NotFound, Unauthorized } from "@api/error";
import { TickersResponse } from "@domain/model/http";
import { HttpApiEndpoint, HttpApiGroup, OpenApi } from "@effect/platform";

import * as Schema from "effect/Schema";

export class TicketsEndpoints extends HttpApiGroup
  .make("tickets")
  .add(
    HttpApiEndpoint.patch("lock", "/lock/:ticketId")
      .setPath(
        Schema.Struct({
          ticketId: Schema.NumberFromString,
        }),
      )
      .addError(InternalServerError)
      .addError(NotFound)
      .addError(Unauthorized),
  )
  .add(
    HttpApiEndpoint.get("getAll", "/")
      .addSuccess(TickersResponse)
      .addError(InternalServerError)
      .addError(NotFound)
      .addError(Unauthorized),
  )
  .prefix("/tickets")
  .annotateContext(
    OpenApi.annotations({
      title: "Ticket Endpoints",
      description: "Ticket lock/unlock/update",
      version: "1.0.0",
    }),
  ) {}
