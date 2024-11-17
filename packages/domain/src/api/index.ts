import { HttpApi } from "@effect/platform";
import { TicketsEndpoints } from "./tickets.ts";
import { UserEndpoints } from "./user.ts";
import { WebSocketEndpoint } from "./websocket.ts";

export { AuthMiddleware, AuthUserId } from "./middleware/authMiddleware.ts";

export const LesBilletsAPI = HttpApi.empty
  .add(UserEndpoints)
  .add(TicketsEndpoints)
  .add(WebSocketEndpoint);
