import * as S from "effect/Schema";

export class User extends S.TaggedClass<User>()("User", {
    email: S.NonEmptyString,
    fullName: S.NonEmptyString,
    id: S.UUID,
    password: S.NonEmptyString,
  },
) {}
