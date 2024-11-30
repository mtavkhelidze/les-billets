import { SqlClient, SqlSchema } from "@effect/sql";
import { SystemUser } from "@my/domain/model";
import { EmailPassword } from "@my/domain/model/utility";

import { flow } from "effect";
import * as Effect from "effect/Effect";
import { QueryError } from "../errors.ts";

const ModuleId = Symbol.for("@my/server/storage/users/queries/users");

export const failWithQueryError = (error: Error) => Effect.fail(
  new QueryError({
    cause: error,
    message: error.toString(),
    module: ModuleId,
  }),
);

export const findByCredsQuery = (sql: SqlClient.SqlClient) =>
  flow(
    SqlSchema.findOne({
      Request: EmailPassword,
      Result: SystemUser,
      execute:
        ({ email, password }) => sql`
            select *
            from
                users
            where
                email = ${email}
                and password = ${password}
        `,
    }),
    Effect.tapError(e => Effect.logError(e.toJSON())),
    Effect.catchAll(failWithQueryError),
    Effect.withLogSpan("findByCredsQuery"),
  );
