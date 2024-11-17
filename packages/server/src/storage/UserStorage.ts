import * as SqliteDrizzle from "@effect/sql-drizzle/Sqlite";
import { UserProfile } from "@my/domain/model";
import { TableUsers } from "@my/domain/storage";
import { and, eq } from "drizzle-orm";
import * as A from "effect/Array";
import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Match from "effect/Match";
import * as O from "effect/Option";
import * as Schema from "effect/Schema";

export class InternalError extends Schema.TaggedError<InternalError>()(
  "InternalError",
  {},
) {}

export class UserNotFound extends Schema.TaggedError<UserNotFound>()(
  "UserNotFound",
  {},
) {}

export const UserStorageError = Schema.Union(
  UserNotFound,
  InternalError,
);
export type UserStorageError = Schema.Schema.Type<typeof UserStorageError>;

export class UserStorage extends Context.Tag("UserStorage")<
  UserStorage,
  {
    findByCreds: (
      email: string,
      password: string,
    ) => Effect.Effect<UserProfile, UserStorageError, SqliteDrizzle.SqliteDrizzle>
  }
>() {
  public static live = Layer.succeed(
    UserStorage,
    UserStorage.of({
        findByCreds: (email: string, password: string) =>
          SqliteDrizzle.SqliteDrizzle.pipe(
            Effect.andThen(
              db => db
                .select()
                .from(TableUsers)
                .where(and(
                    eq(TableUsers.email, email),
                    eq(TableUsers.password, password),
                  ),
                )
                .all(),
            ),
            Effect.flatMap(A.head),
            Effect.map(r =>
              UserProfile.make({
                id: r.id,
                email: r.email,
                name: r.fullName,
                jwtToken: O.none(),
              }),
            ),
            Effect.catchAll(e =>
              Match.value(e).pipe(
                Match.tag(
                  "NoSuchElementException",
                  () => Effect.fail(new UserNotFound()),
                ),
                Match.orElse(() => Effect.zipRight(
                    Effect.logError(e),
                    Effect.fail(new InternalError({ error: e })),
                  ),
                ),
              ),
            ),
          ),
      },
    ),
  )
  ;
}
