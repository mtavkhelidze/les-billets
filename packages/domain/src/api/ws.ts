import { HttpApiEndpoint, HttpApiGroup, OpenApi } from "@effect/platform";
import { AuthMiddleware } from "./middleware/authMiddleware.ts";

export class WebSocketEndpoint extends HttpApiGroup.make("websocket")
  .add(
    HttpApiEndpoint.get("connect", "/ws")
      .middleware(AuthMiddleware)
      .annotateContext(
        OpenApi.annotations({
          summary: "WebSocket Endpoint",
          description: "JSON encoded messages.",
        })),
  ) {}
