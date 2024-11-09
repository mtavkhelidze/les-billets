import * as SqliteDrizzle from "@effect/sql-drizzle/Sqlite";
import { SqliteClient } from "@effect/sql-sqlite-bun";
import { DateTime, pipe } from "effect";
import * as Context from "effect/Context";
import * as Data from "effect/Data";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as O from "effect/Option";
import { Ticket, type TicketsRow, ticketsTable } from "model";
import { dbFile } from "../config.ts";

class StorageError extends Data.TaggedError("StorageError")<{
  error: Error
}> {}

const rowToTicket = (row: TicketsRow): Ticket => Ticket.make({
  id: row.id,
  title: row.title,
  description: row.description,
  status: row.status,
  createdBy: row.createdBy,
  updatedBy: O.fromNullable(row.updatedBy),
  createdAt: toUtc(row.createdAt).pipe(O.getOrElse(() => 0)),
  updatedAt: toUtc(row.updatedAt),
});
const toUtc = (s: string | null) => pipe(
  O.fromNullable(s),
  O.flatMap(DateTime.make),
  O.map(x => x.epochMillis),
);

export const SQLLiteClient = dbFile.pipe(
  Effect.andThen(
    filename => SqliteClient.layer({
      filename,
    }),
  ),
  Layer.unwrapEffect,
);

const getTickets: Effect.Effect<Ticket[], StorageError, SqliteDrizzle.SqliteDrizzle> = SqliteDrizzle.SqliteDrizzle.pipe(
  Effect.andThen(
    db => db.select().from(ticketsTable).all(),
  ),
  Effect.map(rows => rows.map(rowToTicket)),
  Effect.mapError(e => new StorageError({ error: e })),
);

export class DataStorageService extends Context.Tag("DataStorageService")<
  DataStorageService,
  {
    getTickets: Effect.Effect<Ticket[], StorageError, SqliteDrizzle.SqliteDrizzle>;
  }
>() {
  public static live = Layer.succeed(
    DataStorageService,
    DataStorageService.of({
      getTickets,
    }),
  ).pipe(
    Layer.provide(SQLLiteClient),
    Layer.provide(SqliteDrizzle.layer),
  );
}
