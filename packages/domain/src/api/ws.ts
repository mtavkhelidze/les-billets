import { HttpApiEndpoint, HttpApiGroup, OpenApi } from "@effect/platform";

export class WebSocketEndpoint extends HttpApiGroup.make("websocket")
  .add(
    HttpApiEndpoint.get("ws", "/ws")
      .annotateContext(
        OpenApi.annotations({
          summary: "WebSocket Endpoint",
          description: "JSON encoded messages.",
        })),
  ) {}
