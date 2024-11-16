import { UserProfile } from "@my/domain/model";
import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as O from "effect/Option";
import * as Schema from "effect/Schema";

export class UserNotFound extends Schema.TaggedError<UserNotFound>()(
  "UserNotFound",
  {},
) {}

export const UserStorageError = Schema.Union(
  UserNotFound,
);
export type UserStorageError = Schema.Schema.Type<typeof UserStorageError>;

export class UserStorage extends Context.Tag("UserStorage")<
  UserStorage,
  {
    findByCreds: (
      email: string,
      password: string,
    ) => Effect.Effect<UserProfile, UserStorageError>
  }
>() {
  public static live = Layer.succeed(
    UserStorage,
    UserStorage.of({
      findByCreds: (email: string, password: string) => Effect.succeed(
        UserProfile.make({
          email,
          id: "0c1bea23-59f1-49fb-83e7-d91e51ad01fe",
          jwtToken: O.none(),
          name: "John Doe",
        }),
      ),
    }),
  );
}
