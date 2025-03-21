import { HttpApiMiddleware, HttpApiSecurity } from "@effect/platform";
import * as Context from "effect/Context";
import { Unauthorized } from "../../dto/errors.ts";
import { UserProfile } from "../../model";

export class AuthUserId
  extends Context.Tag("UserId")<AuthUserId, UserProfile["id"]>() {}

export class AuthMiddleware extends HttpApiMiddleware.Tag<AuthMiddleware>()(
  "AuthMiddleware",
  {
    failure: Unauthorized,
    provides: AuthUserId,
    security: {
      deToken: HttpApiSecurity.apiKey({
        in: "query",
        key: "token",
      }),
    },
  },
) {}
