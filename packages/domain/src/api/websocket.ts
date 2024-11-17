import { HttpApiEndpoint, HttpApiGroup } from "@effect/platform";
import { ClientMessage, ServerMessage } from "../http/wc.ts";

export class WebSocketEndpoint extends HttpApiGroup.make("websocket")
  .add(
    HttpApiEndpoint.get("wc", "/wc")
  ) {}
