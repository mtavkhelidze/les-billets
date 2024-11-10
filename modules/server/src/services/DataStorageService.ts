import * as SqliteDrizzle from "@effect/sql-drizzle/Sqlite";
import { SqliteClient } from "@effect/sql-sqlite-bun";
import { pipe } from "effect";
import { type ConfigError } from "effect/ConfigError";
import * as Context from "effect/Context";
import * as Data from "effect/Data";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as O from "effect/Option";
import { stringToUtc, Ticket, type TicketsRow, ticketsTable } from "model";
import { dbFile } from "../config.ts";

// region Database Driver

// @misha: this needs to be made into service
const SqlLive = dbFile.pipe(
  Effect.andThen(
    filename => SqliteClient.layer({
      filename,
    }),
  ),
  Layer.unwrapEffect,
);

const DrizzleLive = SqliteDrizzle.layer.pipe(Layer.provide(SqlLive));

export const DatabaseDriver = {
  live: Layer.mergeAll(SqlLive, DrizzleLive),
};

// endregion

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
  createdAt: stringToUtc(row.createdAt).pipe(O.getOrElse(() => 0)),
  updatedAt: stringToUtc(row.updatedAt),
});

export class DataStorageService extends Context.Tag("DataStorageService")<
  DataStorageService,
  {
    getTickets: Effect.Effect<Ticket[], StorageError | ConfigError, SqliteDrizzle.SqliteDrizzle>;
  }
>() {
  public static live = Layer.succeed(
    DataStorageService,
    DataStorageService.of({
      getTickets: pipe(
        SqliteDrizzle.SqliteDrizzle,
        Effect.andThen(db => db.select().from(ticketsTable).all()),
        Effect.map(rows => rows.map(rowToTicket)),
        Effect.mapError(e => new StorageError({ error: e })),
      ),
    }),
  );
}
