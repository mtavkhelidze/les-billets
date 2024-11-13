import * as S from "@effect/schema/Schema";

export class BaseUser extends S.Class<BaseUser>("BaseUser")({
  email: S.NonEmptyString,
  fullName: S.NonEmptyString,
  id: S.UUID,
}) {}

export class UserRecord extends BaseUser.extend<UserRecord>("UserRecord")({
    password: S.NonEmptyString,
  },
) {};
