import {
  stringToUtc,
  Ticket,
  type TicketsRow,
  ticketsTable,
} from "@domain/model";
import * as SqliteDrizzle from "@effect/sql-drizzle/Sqlite";
import { pipe } from "effect";
import { type ConfigError } from "effect/ConfigError";
import * as Context from "effect/Context";
import * as Data from "effect/Data";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as O from "effect/Option";

class TicketStorageError extends Data.TaggedError("TicketStorageError")<{
  error: Error
}> {}

const rowToTicket = (row: TicketsRow): Ticket => Ticket.make({
  createdAt: stringToUtc(row.createdAt).pipe(O.getOrElse(() => 0)),
  createdBy: row.createdBy,
  description: row.description,
  id: row.id,
  status: row.status,
  title: row.title,
  updatedAt: stringToUtc(row.updatedAt),
  updatedBy: O.fromNullable(row.updatedBy),
});

export class TicketStorage extends Context.Tag("TicketStorage")<
  TicketStorage,
  {
    getTickets: Effect.Effect<Ticket[], TicketStorageError | ConfigError, SqliteDrizzle.SqliteDrizzle>;
  }
>() {
  public static live = Layer.succeed(
    TicketStorage,
    TicketStorage.of({
      getTickets: pipe(
        SqliteDrizzle.SqliteDrizzle,
        Effect.andThen(db => db.select().from(ticketsTable).all()),
        Effect.map(rows => rows.map(rowToTicket)),
        Effect.mapError(e => new TicketStorageError({ error: e })),
      ),
    }),
  );
}
