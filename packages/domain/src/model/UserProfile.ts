import * as S from "effect/Schema";
import { SystemUser } from "./SystemUser.ts";

export class UserProfile extends SystemUser.extend<UserProfile>(
  "UserProfile",
)(
  {
    jwtToken: S.String,
  }) {}
