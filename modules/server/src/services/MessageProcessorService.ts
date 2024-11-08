import { pipe } from "effect";
import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Match from "effect/Match";
import type { ParseError } from "effect/ParseResult";
import * as Schema from "effect/Schema";
import { ClientMessage, GetTickets, LockTicket, UpdateTicket } from "model";
import type { WebSocketConnection } from "./ConnectionStreamService.ts";

const onGetTickets = (wsc: WebSocketConnection) => (m: GetTickets) =>
  Effect.logInfo(`>>>>>>> GetTickets: ${wsc.id}`);

const onLockTicket = (wsc: WebSocketConnection) => (m: LockTicket) =>
  Effect.logInfo(`>>>>>>> LockTicket: ${wsc.id}`);

const onUpdateTicket = (wsc: WebSocketConnection) => (m: UpdateTicket) =>
  Effect.logInfo(`>>>>>>> UpdateTicket: ${wsc.id}`);

const fromJson = (msg: string) => Effect.try({
  try: () => Schema.decodeUnknownSync(Schema.parseJson(ClientMessage))(msg),
  catch: (e) => e as ParseError,
});

const dispatch = (wsc: WebSocketConnection) =>
  Match.type<ClientMessage>().pipe(
    Match.tag("GetTickets", onGetTickets(wsc)),
    Match.tag("LockTicket", onLockTicket(wsc)),
    Match.tag("UpdateTicket", onUpdateTicket(wsc)),
    Match.exhaustive,
  );

export class MessageProcessorService extends Context.Tag(
  "MessageProcessorService")<
  MessageProcessorService,
  {
    process: (socket: WebSocketConnection) => (msg: string) =>
      Effect.Effect<void, never, never>;
  }
>() {
  public static live = Layer.succeed(
    MessageProcessorService,
    MessageProcessorService.of({
      process: (wsc: WebSocketConnection) => (msg: string) =>
        pipe(
          fromJson(msg),
          Effect.andThen(dispatch(wsc)),
          Effect.catchAll(e => Effect.logError(`Cannot parse ${msg}`)),
        ),
    }),
  );
}
