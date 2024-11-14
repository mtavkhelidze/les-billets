// @misha: this needs to be made into service
import * as SqliteDrizzle from "@effect/sql-drizzle/Sqlite";
import { SqliteClient } from "@effect/sql-sqlite-bun";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import { dbFile } from "../config.ts";

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
