import * as S from "effect/Schema";
import { UserProfile } from "../model";

export class LoginRequest extends S.Class<LoginRequest>("LoginRequest")(
  {
    email: S.NonEmptyString,
    password: S.NonEmptyString,
  },
) {}

export class LoginResponse
  extends UserProfile.extend<LoginResponse>("LoginResponse")({}) {}

