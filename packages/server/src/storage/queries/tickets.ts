import { SqlClient, SqlSchema } from "@effect/sql";
import { Ticket } from "@my/domain/model";

import { flow } from "effect";
import * as Effect from "effect/Effect";
import * as O from "effect/Option";
import * as Schema from "effect/Schema";
import { QueryError } from "./errors.ts";

const ModuleId = Symbol.for("@my/server/storage/queries/tickets");

export const failWithQueryError = (error: Error) => Effect.fail(
  new QueryError({
    cause: error,
    message: error.toString(),
    module: ModuleId,
  }),
);

const TicketRow = Ticket.pipe(
  Schema.omit("updatedBy"),
  Schema.extend(
    Schema.Struct({
      updatedBy: Schema.NullOr(Schema.String),
    }),
  ),
);

type TicketRow = Schema.Schema.Type<typeof TicketRow>;

const toTicket = (row: TicketRow): Ticket => Ticket.make({
  ...row,
  updatedBy: O.fromNullable(row.updatedBy),
});

const toTicketList = (rows: readonly TicketRow[]): readonly Ticket[] =>
  rows.map(toTicket);

export const getTicketsQuery = (sql: SqlClient.SqlClient) =>
  flow(
    SqlSchema.findAll({
      Request: Schema.Void,
      Result: TicketRow,
      execute: () => sql`select *
                         from
                             tickets`,
    }),
    Effect.map(toTicketList),
    Effect.tapError(e => Effect.logError(e.message)),
    Effect.catchAll(failWithQueryError),
    Effect.withLogSpan("getTicketsQuery"),
  )
;
