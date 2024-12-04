import {
  HttpApiBuilder,
  HttpServerRequest,
  HttpServerResponse,
} from "@effect/platform";
import { LesBilletsAPI } from "@my/domain/api";
import { clientCableFromJson } from "@my/domain/utils";
import { CableReaderService } from "@services/CableReader.ts";
import { CentralTelegraph } from "@services/TelegraphService.ts";
import * as Effect from "effect/Effect";
import * as Stream from "effect/Stream";

export const WsController = HttpApiBuilder.group(
  LesBilletsAPI,
  "websocket",
  handlers => handlers.handle("connect", () => {
    return Effect.all([CentralTelegraph, CableReaderService]).pipe(
      Effect.andThen(([teletype, reader]) => teletype.wire().pipe(
          Stream.tap(Effect.logDebug),
          Stream.map(JSON.stringify),
          Stream.pipeThroughChannel(HttpServerRequest.upgradeChannel()),
          Stream.decodeText("utf-8"),
          Stream.flatMap(clientCableFromJson),
          Stream.runForEach(reader.processIncoming),
          Effect.catchAll(e => Effect.logError(e)),
          Effect.as(HttpServerResponse.setStatus(101, "Switching Protocols")),
          Effect.as(HttpServerResponse.empty),
        ),
      ),
    );
  }),
);
