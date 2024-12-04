import * as Schema from "effect/Schema";
import { UserProfile } from "../model";

export class LoginRequest extends Schema.TaggedClass<LoginRequest>(
  "@my/domain/user/LoginRequest",
)(
  "LoginRequest",
  {
    email: Schema.NonEmptyString,
    password: Schema.NonEmptyString,
  },
) {}

export class LoginResponse
  extends UserProfile.extend<LoginResponse>("LoginResponse")({}) {}

