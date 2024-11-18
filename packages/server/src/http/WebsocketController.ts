import {
  HttpApiBuilder,
  HttpServerRequest,
  HttpServerResponse,
  Socket,
} from "@effect/platform";
import type { RequestError } from "@effect/platform/HttpServerError";
import { LesBilletsAPI } from "@my/domain/api";
import { type ServerCable, TicketList } from "@my/domain/http";
import { CentralTelegraph } from "@services/CentralTelegraph.ts";
import { Schedule } from "effect";
import * as Channel from "effect/Channel";
import * as Chunk from "effect/Chunk";
import * as Effect from "effect/Effect";
import * as Stream from "effect/Stream";

type WebSocketChannel = Channel.Channel<
  Chunk.Chunk<Uint8Array>,
  Chunk.Chunk<Uint8Array | string | Socket.CloseEvent>,
  RequestError | Socket.SocketError,
  never,
  void,
  unknown,
  HttpServerRequest.HttpServerRequest
>;

const sendCables = (cable: ServerCable) => CentralTelegraph.pipe(
  Effect.andThen(teletype => teletype.send(cable)),
  Effect.as("sendCables"),
);

const ping = () => Stream.fromSchedule(Schedule.spaced(1000)).pipe(
  Stream.map(_ => `ping`),
  Stream.runForEach(_ => sendCables(TicketList.make({ tickets: [] }))),
);

export const WebsocketController = HttpApiBuilder.group(
  LesBilletsAPI,
  "websocket",
  handlers => {
    return handlers.handle("ws", () => Effect.gen(function* () {
        const wsStream = CentralTelegraph.pipe(
          Effect.andThen(teletype => teletype.wire().pipe(
              Stream.map(JSON.stringify),
              Stream.pipeThroughChannel(HttpServerRequest.upgradeChannel()),
              Stream.decodeText(),
              Stream.runForEach((_) => Effect.log(_)),
              Effect.annotateLogs("ws", "recv"),
              Effect.catchAll(e => Effect.logError(e)),
              Effect.as(HttpServerResponse.empty()),
            ),
          ),
        );

        // const socket = HttpServerRequest.upgrade;
        // const sender = CentralTelegraph.pipe(
        //   Effect.andThen(teletype => teletype.wire()),
        //   Effect.map(Stream.fromPubSub<ServerCable>),
        //   Effect.andThen(updates => socket.pipe(
        //       Effect.flatMap(s => s.writer),
        //       Effect.flatMap(send => updates.pipe(
        //           Stream.runForEach(u => send(u.toString())),
        //         ),
        //       ),
        //     ),
        //   ),
        //   Effect.annotateLogs("ws", "send"),
        //   Effect.catchAll(e => Effect.logError(e)),
        // );

        yield* Effect.raceAll([wsStream, ping()]);
      }),
    );
  },
);
