import * as S from "@effect/schema/Schema";
import * as O from "effect/Option";
import { BaseUser } from "model/src/UserRecord.ts";

export class WebUser extends BaseUser.extend<WebUser>("WebUser")({
  jwtToken: S.String.pipe(
    S.Option,
    S.optionalWith({ default: () => O.none(), exact: true }),
  ),
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

