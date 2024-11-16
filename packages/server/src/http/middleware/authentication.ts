import { HttpApiMiddleware, HttpApiSecurity } from "@effect/platform";
import { Unauthorized } from "@my/domain/http/errors";
import { UserProfile } from "@my/domain/model";
import { JwtBackend } from "@services/JwtBackend.ts";
import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Redacted from "effect/Redacted";

export class AuthUserId
  extends Context.Tag("UserId")<AuthUserId, UserProfile["id"]>() {}

export class Authentication extends HttpApiMiddleware.Tag<Authentication>()(
  "Authentication",
  {
    failure: Unauthorized,
    provides: AuthUserId,
    security: {
      deToken: HttpApiSecurity.bearer,
    },
  },
) {
  public static middleware = Layer.effect(
    Authentication,
    Effect.succeed(
      Authentication.of({
        deToken: (redactedToken: Redacted.Redacted<string>) => {
          return JwtBackend.pipe(
            Effect.andThen(jbe => redactedToken.pipe(
                Redacted.value,
                jbe.unwrap,
              ),
            ),
            Effect.catchAll(e => Effect.logError(`Cannot authorize: ${e}`).pipe(
                Effect.zipRight(Effect.fail(new Unauthorized())),
              ),
            ),
            Effect.provide(JwtBackend.live),
          );
        },
      }),
    ),
  );
}
