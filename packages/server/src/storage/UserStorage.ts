import { SqlClient } from "@effect/sql";
import { SystemUser } from "@my/domain/model";
import { type EmailPassword } from "@my/domain/utils";
import { flow, pipe } from "effect";
import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as O from "effect/Option";
import * as Schema from "effect/Schema";
import { findByCredsQuery } from "./queries/users.ts";

export class UserNotFound extends Schema.TaggedError<UserNotFound>(
  Symbol.for("@my/server/storage/UserStorage/UserNotFound").toString(),
)("UserNotFound", {}) {}

export const UserStorageError = Schema.Union(
  UserNotFound,
);
export type UserStorageError = Schema.Schema.Type<typeof UserStorageError>;

interface UserStorage {
  findByCreds: (_: EmailPassword) => Effect.Effect<SystemUser, UserStorageError>;
}

export class UserStorageService extends Context.Tag("UserStorageService")<
  UserStorageService, UserStorage
>() {
  public static live = Layer.effect(
    UserStorageService,
    pipe(
      SqlClient.SqlClient,
      Effect.andThen(sql => UserStorageService.of({
          findByCreds: flow(
            findByCredsQuery(sql),
            Effect.flatMap(O.match({
                onNone: () => Effect.fail(new UserNotFound()),
                onSome: user => Effect.succeed(user),
              }),
            ),
            Effect.catchAll(e =>
              Effect.fail(new UserStorageError({ error: e })).pipe(
                Effect.zipLeft(Effect.logError(e.toJSON())),
              ),
            ),
          ),
        }),
      ),
    ),
  );
}
