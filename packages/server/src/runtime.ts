import { HttpServer } from "@effect/platform";
import { BunRuntime } from "@effect/platform-bun";
import { ConfigError, Exit, pipe } from "effect";
import * as Effect from "effect/Effect";

export const bunRunServer = (
  effect: Effect.Effect<never, ConfigError.ConfigError, HttpServer.HttpServer>,
) => {
  const main = effect.pipe(
    // @misha: This is going to bite me in the arse some day.
    x => x as Effect.Effect<never, ConfigError.ConfigError, never>,
    Effect.catchAllCause(cause => pipe(
        Effect.logFatal("Cannot continue", cause),
        Effect.andThen(Exit.fail(cause)),
      ),
    ),
  );
  BunRuntime.runMain(
    main,
    {
      disablePrettyLogger: process.env.NODE_ENV === "production",
    },
  )
  ;
};
