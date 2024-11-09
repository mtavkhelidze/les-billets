import * as SqliteDrizzle from "@effect/sql-drizzle/Sqlite";
import { SqliteClient } from "@effect/sql-sqlite-bun";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import { dbFile } from "../../config.ts";

const SQLLiteBackend = dbFile.pipe(
  Effect.andThen(
    filename => SqliteClient.layer({
      filename,
    }),
  ),
  Layer.unwrapEffect,
);

export const StorageBackend =
  SqliteDrizzle
    .layer
    .pipe(
      Layer.provide(SQLLiteBackend),
    );

