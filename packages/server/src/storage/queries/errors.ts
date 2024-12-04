import { ErrorShape } from "@my/domain/model/utility";
import * as Schema from "effect/Schema";

export class QueryError extends Schema.TaggedError<QueryError>(
  Symbol.for("@my/server/storage/tickets/QueryError").toString(),
)("QueryError", ErrorShape) {}

export const TicketStorageError = Schema.Union(
  QueryError,
);
export type TicketStorageError = Schema.Schema.Type<typeof TicketStorageError>;
