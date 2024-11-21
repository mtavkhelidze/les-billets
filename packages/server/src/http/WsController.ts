import {
  HttpApiBuilder,
  HttpServerRequest,
  HttpServerResponse,
} from "@effect/platform";
import { LesBilletsAPI } from "@my/domain/api";
import { clientCableFromJson } from "@my/domain/utils";
import { CableReader } from "@services/CableReader.ts";
import { CentralTelegraph } from "@services/TelegraphService.ts";
import * as Console from "effect/Console";
import * as Effect from "effect/Effect";
import * as Stream from "effect/Stream";

export const WsController = HttpApiBuilder.group(
  LesBilletsAPI,
  "websocket",
  handlers => handlers.handle("connect", () => {
    console.log("New connection");
    return Effect.all([CentralTelegraph, CableReader]).pipe(
      Effect.andThen(([teletype, reader]) => teletype.wire().pipe(
          Stream.map(JSON.stringify),
          Stream.pipeThroughChannel(HttpServerRequest.upgradeChannel()),
          Stream.decodeText("utf-8"),
          Stream.flatMap(clientCableFromJson),
          Stream.runForEach(reader.react),
          Effect.annotateLogs("ws", "recv"),
          Effect.catchAll(e => Effect.logError(e)),
          Effect.as(HttpServerResponse.setStatus(101, "Switching Protocols")),
          Effect.as(HttpServerResponse.text("")),
        ),
      ),
    );
  }),
);
