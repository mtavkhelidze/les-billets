import { HttpApi, OpenApi } from "@effect/platform";
import { TicketsEndpoints } from "./tickets.ts";
import { UserEndpoints } from "./user.ts";

export { AuthMiddleware, AuthUserId } from "./middleware/authMiddleware.ts";

export class LesBilletsAPI extends HttpApi.empty
  .add(TicketsEndpoints)
  .add(UserEndpoints)
  .annotateContext(
    OpenApi.annotations({
      title: "Les Billets LesBilletsAPI",
      version: "1.0.0",
    }),
  ) {}

