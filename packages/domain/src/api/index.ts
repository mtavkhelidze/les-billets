import {
  HttpApi,
  HttpApiClient,
  HttpClient,
  HttpClientRequest,
} from "@effect/platform";
import { TicketsEndpoints } from "./tickets.ts";
import { UserEndpoints } from "./user.ts";

export { AuthMiddleware, AuthUserId } from "./middleware/authMiddleware.ts";

export const LesBilletsAPI = HttpApi.empty
  .add(UserEndpoints)
   .add(TicketsEndpoints);
