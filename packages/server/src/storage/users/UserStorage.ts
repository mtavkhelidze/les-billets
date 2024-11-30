import { SqlClient } from "@effect/sql";
import { SystemUser } from "@my/domain/model";
import type { EmailPassword } from "@my/domain/model/utility";
import { DataBaseDriver } from "@storage";
import { flow, pipe } from "effect";
import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as O from "effect/Option";
import { UserNotFound, UserStorageError } from "./errors.ts";
import { findByCredsQuery } from "./queries/users.ts";

interface UserStorageService {
  findByCreds: (_: EmailPassword) => Effect.Effect<SystemUser, UserStorageError>;
}

export const UserStorageService =
  Context.GenericTag<UserStorageService>("UserStorageService");

export const UserStorageSqlLite = Layer.effect(
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
        ),
      }),
    ),
  ),
).pipe(
  Layer.provide(DataBaseDriver.live),
);
