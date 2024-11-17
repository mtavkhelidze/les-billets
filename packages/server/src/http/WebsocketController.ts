import { HttpApiBuilder, HttpServerRequest } from "@effect/platform";
import { LesBilletsAPI } from "@my/domain/api";
import { Console } from "effect";
import * as Effect from "effect/Effect";
import * as Stream from "effect/Stream";

export const WebsocketController = HttpApiBuilder.group(
  LesBilletsAPI,
  "websocket",
  handlers => handlers
    .handle("wc", () => Stream.empty.pipe(
        Stream.pipeThroughChannel(
          HttpServerRequest.upgradeChannel(),
        ),
        Stream.map(JSON.stringify),
        Stream.runForEach(Console.log),
        Effect.ignoreLogged,
      ),
    ),
);
