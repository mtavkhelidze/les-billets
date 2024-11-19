import {
  HttpApiBuilder,
  HttpServerRequest,
  HttpServerResponse,
} from "@effect/platform";
import { LesBilletsAPI } from "@my/domain/api";
import { type ServerCable, TicketList } from "@my/domain/http";
import { CableReader } from "@services/CableReader.ts";
import { CentralTelegraph } from "@services/TelegraphService.ts";
import { Schedule } from "effect";
import * as Effect from "effect/Effect";
import * as Stream from "effect/Stream";

const sendCables = (cable: ServerCable) => CentralTelegraph.pipe(
  Effect.andThen(teletype => teletype.send(cable)),
  Effect.as("sendCables"),
);

const ping = () => Stream.fromSchedule(Schedule.spaced(1000)).pipe(
  Stream.map(_ => `ping`),
  Stream.runForEach(_ => sendCables(TicketList.make({ tickets: [] }))),
);

export const WsController = HttpApiBuilder.group(
  LesBilletsAPI,
  "websocket",
  handlers => handlers.handle("ws", () =>
    Effect.all([CentralTelegraph, CableReader]).pipe(
      Effect.andThen(([teletype, readCable]) => teletype.wire().pipe(
          Stream.map(JSON.stringify),
          Stream.pipeThroughChannel(HttpServerRequest.upgradeChannel()),
          Stream.decodeText(),
          Stream.runForEach(readCable),
          Effect.annotateLogs("ws", "recv"),
          Effect.catchAll(e => Effect.logError(e)),
          Effect.as(HttpServerResponse.empty()),
        ),
      ),
    ),
  ),
);
