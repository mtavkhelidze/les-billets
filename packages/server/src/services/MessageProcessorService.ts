import {
  AllTickets,
  ClientMessage,
  clientMessageFromJson,
  GetTickets,
  LockTicket,
  serverMessageToJson,
  UnlockTicket,
  UpdateTicket,
} from "@domain/model";
import * as SqliteDrizzle from "@effect/sql-drizzle/Sqlite";
import { SqlClient } from "@effect/sql/SqlClient";
import { TicketStorageService } from "@storage";
import { pipe } from "effect";
import * as Context from "effect/Context";
import * as Data from "effect/Data";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Match from "effect/Match";
import type { WebSocketConnection } from "./ConnectionRegistry.ts";

class ProcessorError extends Data.TaggedError("ProcessorError")<{
  error: Error
}> {}

const onGetTickets = (wsc: WebSocketConnection) => (m: GetTickets) =>
  pipe(
    TicketStorageService,
    Effect.andThen(service => service.getTickets),
    Effect.andThen(tickets => new AllTickets({ tickets })),
    Effect.andThen(serverMessageToJson),
    Effect.flatMap(
      json => Effect.try({
        try: () => wsc.ws.send(json),
        catch: error => new ProcessorError({ error: error as DOMException }),
      }),
    ),
    Effect.provide(SqliteDrizzle.layer),
  );

const onLockTicket = (wsc: WebSocketConnection) => (m: LockTicket) =>
  Effect.logInfo(`>>>>>>> LockTicket: ${wsc.id}`);

const onUnlockTicket = (wsc: WebSocketConnection) => (m: UnlockTicket) =>
  Effect.logInfo(`>>>>>>> UnlockTicket: ${wsc.id}`);

const onUpdateTicket = (wsc: WebSocketConnection) => (m: UpdateTicket) =>
  Effect.logInfo(`>>>>>>> UpdateTicket: ${wsc.id}`);

const dispatch = (wsc: WebSocketConnection) =>
  Match.type<ClientMessage>().pipe(
    Match.tag("GetTickets", onGetTickets(wsc)),
    Match.tag("LockTicket", onLockTicket(wsc)),
    Match.tag("UnlockTicket", onUnlockTicket(wsc)),
    Match.tag("UpdateTicket", onUpdateTicket(wsc)),
    Match.exhaustive,
  );

export class MessageProcessorService extends Context.Tag(
  "MessageProcessorService")<
  MessageProcessorService,
  {
    process: (socket: WebSocketConnection) => (msg: string) =>
      Effect.Effect<void, never, SqlClient | TicketStorageService>;
  }
>() {
  public static live = Layer.succeed(
    MessageProcessorService,
    MessageProcessorService.of({
      process: (wsc: WebSocketConnection) => (msg: string) =>
        pipe(
          clientMessageFromJson(msg),
          Effect.andThen(dispatch(wsc)),
          Effect.catchAll(e => Effect.logError(`${wsc.id}: cannot process \`${msg.trim()}\``)),
        ),
    }),
  );
}
