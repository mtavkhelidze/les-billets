import { Unauthorized } from "@api/error";
import { UserProfile } from "@domain/model";
import { HttpApiMiddleware, HttpApiSecurity } from "@effect/platform";
import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Redacted from "effect/Redacted";
import { JwtBackend } from "../../services/JwtBackend.ts";

class UserId
  extends Context.Tag("UserId")<UserId, UserProfile["id"]>() {}

export class Authorization extends HttpApiMiddleware.Tag<Authorization>()(
  "Authorization",
  {
    failure: Unauthorized,
    provides: UserId,
    security: {
      deToken: HttpApiSecurity.bearer,
    },
  },
) {
  public static middleware = Layer.effect(
    Authorization,
    Effect.succeed(
      Authorization.of({
        deToken: (redactedToken: Redacted.Redacted<string>) =>
          JwtBackend.pipe(
            Effect.flatMap(jbe => redactedToken.pipe(
                Redacted.value,
                jbe.unwrap,
              ),
            ),
            Effect.catchAll(e => Effect.logError(`Cannot authorize: ${e}`).pipe(
                Effect.zipRight(Effect.fail(new Unauthorized())),
              ),
            ),
            Effect.provide(JwtBackend.live),
          ),
      }),
    ),
  );
}