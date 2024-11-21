import {
  HttpApiEndpoint,
  HttpApiGroup,
  HttpServerResponse,
  OpenApi,
} from "@effect/platform";
import * as S from "effect/Schema";
import type * as Stream from "effect/Stream";

export class WebSocketEndpoint extends HttpApiGroup.make("websocket")
  .add(
    HttpApiEndpoint.get("connect", "/ws")
      .annotateContext(
        OpenApi.annotations({
          summary: "WebSocket Endpoint",
          description: "JSON encoded messages.",
        })),
  ) {}
