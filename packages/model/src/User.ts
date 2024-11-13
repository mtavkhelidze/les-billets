import * as S from "@effect/schema/Schema";

export const User = S.Struct({
    email: S.NonEmptyString,
    fullName: S.NonEmptyString,
    id: S.UUID,
    password: S.NonEmptyString,
  },
);

export type User = S.Schema.Type<typeof User>
