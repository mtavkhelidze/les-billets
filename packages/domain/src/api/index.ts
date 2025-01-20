import { HttpApi } from "@effect/platform";
import { TicketsEndpoints } from "./tickets.ts";
import { UserEndpoints } from "./user.ts";
import { WebSocketEndpoint } from "./ws.ts";

export { AuthMiddleware, AuthUserId } from "./middleware/authMiddleware.ts";

// https://github.com/Effect-TS/effect/blob/main/packages/platform-node/examples/api.ts

export class LesBilletsAPI extends HttpApi.empty
  .add(UserEndpoints)
  .add(TicketsEndpoints)
  .add(WebSocketEndpoint) {}
