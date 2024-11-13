import * as S from "@effect/schema/Schema";

export class BaseUser extends S.Class<BaseUser>("BaseUser")({
  email: S.NonEmptyString,
  fullName: S.NonEmptyString,
  id: S.UUID,
}) {}

export class UserWithPassword extends BaseUser.extend<UserWithPassword>("UserWithPassword")({
    password: S.NonEmptyString,
  },
) {};

export class WebUser extends BaseUser.extend<WebUser>("WebUser")({
  jwtToken: S.String.pipe(S.Option),
}) {
  // @misha: directly from Scala
  public copy = (obj: Partial<WebUser>): WebUser =>
    new WebUser({
      id: obj.id ?? this.id,
      fullName: obj.fullName ?? this.fullName,
      email: obj.email ?? this.email,
      jwtToken: obj.jwtToken ?? this.jwtToken,
    });
}
