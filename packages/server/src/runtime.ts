import { runMain } from "@effect/platform-bun/BunRuntime";
import { Exit, pipe } from "effect";
import * as Effect from "effect/Effect";

export const bunRunProgram = <A, E>(effect: Effect.Effect<A, E, unknown>) => {
  runMain(
    effect.pipe(
      // @misha: This is going to bite me in the arse some day.
      x => x as Effect.Effect<never, never, never>,
      Effect.catchAllCause(cause => pipe(
          Effect.logFatal("Cannot continue", cause),
          Effect.andThen(Exit.fail(cause)),
        ),
      ),
    ),
    {
      disablePrettyLogger: process.env.NODE_ENV === "production",
    },
  );
};
