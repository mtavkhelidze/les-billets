import { runMain } from "@effect/platform-bun/BunRuntime";
import { Exit, pipe } from "effect";
import * as Effect from "effect/Effect";

export const bunRunProgram = <A, E>(effect: Effect.Effect<A, E>) => {
  runMain(
    effect.pipe(
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
