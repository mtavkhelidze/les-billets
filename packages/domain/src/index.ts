import * as S from "effect/Schema";
import * as Data from "effect/Data";

export class ModelError extends Data.TaggedError("ModelError")<{
  error: Error;
}> {}

export { Ticket } from "./Ticket.ts";
export { UserProfile } from "./UserProfile.ts";


export { ticketsTable, usersTable, type TicketsRow } from "./schema.ts";
export { AllTickets, ServerMessage } from "./ServerMessage.ts";

export {
  ClientMessage, GetTickets, LockTicket, UpdateTicket, UnlockTicket,
} from "./ClientMessage.ts";

export { clientMessageFromJson, serverMessageToJson } from "./util.ts";

export { stringToUtc } from "./util.ts";
export { ServerPing } from "./ServerMessage.ts";
