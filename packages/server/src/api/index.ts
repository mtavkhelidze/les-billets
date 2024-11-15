import { HttpApi, OpenApi } from "@effect/platform";
import { TicketsEndpoints } from "./tickets.ts";
import { UserEndpoints } from "./user.ts";

export class API extends HttpApi.empty
  .add(TicketsEndpoints)
  .add(UserEndpoints)
  .annotateContext(
    OpenApi.annotations({
      title: "Les Billets API",
      version: "1.0.0",
    }),
  ) {}

