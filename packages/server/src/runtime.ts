import { BunRuntime } from "@effect/platform-bun";
import { Exit, pipe } from "effect";
import * as Effect from "effect/Effect";

export const bunRunProgram = <A, E>(effect: Effect.Effect<A, E>) => {
  BunRuntime.runMain(
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
