import * as Data from "effect/Data";

export class ModelError extends Data.TaggedError("ModelError")<{
  error: Error;
}> {}

export { AllTickets, ServerMessage } from "./ServerMessage.ts";
export {
  ClientMessage, GetTickets, LockTicket, UpdateTicket, UnlockTicket,
} from "./ClientMessage.ts";
export { Ticket } from "./Ticket.ts";
export { UserProfile } from "./UserProfile.ts";
export { clientMessageFromJson, serverMessageToJson } from "./util.ts";
export { stringToUtc } from "./util.ts";
export { ticketsTable, usersTable, type TicketsRow } from "./schema.ts";
export { ServerPing } from "./ServerMessage.ts";
