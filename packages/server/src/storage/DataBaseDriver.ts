// @misha: this needs to be made into service
import { SqliteClient } from "@effect/sql-sqlite-bun";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import { dbFile } from "../config.ts";

export const DataBaseDriver = {
  live: dbFile.pipe(
    Effect.tap(filename => Effect.log(`Using database file: ${filename}`)),
    Effect.andThen(filename => SqliteClient.layer({ filename })),
    Layer.unwrapEffect,
  ),
};
