import * as S from "effect/Schema";
import { SystemUser } from "./SystemUser.ts";

export class UserProfile extends SystemUser.extend<UserProfile>(
  "UserProfile",
)(
  {
    jwtToken: S.String,
  }) {
  // @misha: directly from Scala
  public copy = (obj: UserProfile): UserProfile =>
    new UserProfile({
      id: obj.id ?? this.id,
      name: obj.name ?? this.name,
      email: obj.email ?? this.email,
      jwtToken: obj.jwtToken ?? this.jwtToken,
    });
}
