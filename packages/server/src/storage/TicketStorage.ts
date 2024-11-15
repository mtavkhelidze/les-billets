import {
  stringToUtc,
  Ticket,
  type TicketsRow,
  ticketsTable,
} from "@domain/model";

import * as SqliteDrizzle from "@effect/sql-drizzle/Sqlite";
import { eq } from "drizzle-orm";
import * as Context from "effect/Context";
import * as Data from "effect/Data";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as O from "effect/Option";

class TicketStorageError extends Data.TaggedError("TicketStorageError")<{
  error: Error
}> {}

const rowsToTickets = (rows: TicketsRow[]): Ticket[] => rows.map(row =>
  Ticket.make(
    {
      createdAt: stringToUtc(row.createdAt).pipe(O.getOrElse(() => 0)),
      createdBy: row.createdBy,
      description: row.description,
      id: row.id,
      status: row.status,
      title: row.title,
      updatedAt: stringToUtc(row.updatedAt),
      updatedBy: O.fromNullable(row.updatedBy),
    }),
);

export class TicketStorage extends Context.Tag("TicketStorage")<
  TicketStorage,
  {
    getTickets: () => Effect.Effect<Ticket[], TicketStorageError, SqliteDrizzle.SqliteDrizzle>;
    lockTicket: (ticketId: string) => Effect.Effect<void, TicketStorageError, SqliteDrizzle.SqliteDrizzle>;
  }
>() {
  public static live = Layer.succeed(
    TicketStorage,
    TicketStorage.of({
      lockTicket: (ticketId: string) =>
        SqliteDrizzle.SqliteDrizzle.pipe(
          Effect.andThen(
            db => db.update(ticketsTable)
              .set({ status: "locked" })
              .where(eq(ticketsTable.id, ticketId)),
          ),
          Effect.flatMap(_ => Effect.void),
          Effect.catchAll(e => Effect.fail(new TicketStorageError({ error: e }))),
          Effect.tapError(Effect.logError),
        ),
      getTickets: () =>
        SqliteDrizzle.SqliteDrizzle.pipe(
          Effect.andThen(
            db => db.select()
              .from(ticketsTable)
              .all(),
          ),
          Effect.map(rowsToTickets),
          Effect.catchAll(e => Effect.fail(new TicketStorageError({ error: e }))),
          Effect.tapError(Effect.logError),
        ),
    }),
  );
}
