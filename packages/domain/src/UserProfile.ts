import * as S from "effect/Schema";

export class UserProfile extends S.Class<UserProfile>("UserProfile")({
  email: S.NonEmptyString,
  fullName: S.NonEmptyString,
  id: S.UUID,
  jwtToken: S.String.pipe(S.Option),
}) {
  // @misha: directly from Scala
  public copy = (obj: Partial<UserProfile>): UserProfile =>
    new UserProfile({
      id: obj.id ?? this.id,
      fullName: obj.fullName ?? this.fullName,
      email: obj.email ?? this.email,
      jwtToken: obj.jwtToken ?? this.jwtToken,
    });
}
