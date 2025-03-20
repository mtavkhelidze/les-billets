import { AuthMiddleware } from "@my/domain/api";
import { Unauthorized } from "@my/domain/dto";
import { JwtBackend } from "@services/JwtBackend.ts";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Redacted from "effect/Redacted";

export const AuthMiddlewareLive = Layer.effect(
  AuthMiddleware,
  Effect.succeed(
    AuthMiddleware.of({
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
