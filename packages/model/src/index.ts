import * as Data from "effect/Data";

export class ModelError extends Data.TaggedError("ModelError")<{
  error: Error;
}> {}

export { AllTickets, ServerMessage } from "./ServerMessage.ts";

export {
  ClientMessage, GetTickets, LockTicket, UpdateTicket,
} from "./ClientMessage.ts";

export { clientMessageFromJson, serverMessageToJson } from "./util.ts";

export { Ticket } from "./Ticket.ts";

export { ticketsTable, usersTable, type TicketsRow } from "./schema.ts";

export { stringToUtc } from "./util.ts";

export { User } from "./User.ts";
