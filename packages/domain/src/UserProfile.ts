import * as S from "effect/Schema";

export class UserProfile extends S.Class<UserProfile>("UserProfile")({
  email: S.NonEmptyString,
  name: S.NonEmptyString,
  id: S.UUID,
  jwtToken: S.String.pipe(S.Option),
}) {
  // @misha: directly from Scala
  public copy = (obj: Partial<UserProfile>): UserProfile =>
    new UserProfile({
      id: obj.id ?? this.id,
      name: obj.name ?? this.name,
      email: obj.email ?? this.email,
      jwtToken: obj.jwtToken ?? this.jwtToken,
    });
}
