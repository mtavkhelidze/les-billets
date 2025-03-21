import { HttpApiEndpoint, HttpApiGroup, OpenApi } from "@effect/platform";
import { TicketsResponse } from "../dto";
import {
  InternalServerError,
  NotFound,
  Unauthorized,
} from "@my/domain/dto";
import { AuthMiddleware } from "./middleware/authMiddleware.ts";

export class TicketsEndpoints extends HttpApiGroup
  .make("tickets")
  // .add(
  //   HttpApiEndpoint.patch("lock", "/lock/:ticketId")
  //     .setPath(
  //       Schema.Struct({
  //         ticketId: Schema.NumberFromString,
  //       }),
  //     )
  //     .addError(InternalServerError)
  //     .addError(NotFound)
  //     .addError(Unauthorized),
  // )
  .add(
    HttpApiEndpoint.get("getAll", "/")
      .addError(InternalServerError)
      .addError(NotFound)
      .addError(Unauthorized)
      .addSuccess(TicketsResponse),
  )
  .prefix("/tickets")
  .middleware(AuthMiddleware)
  .annotateContext(
    OpenApi.annotations({
      title: "Ticket Endpoints",
      description: "Ticket lock/unlock/update",
      version: "1.0.0",
    }),
  ) {}
