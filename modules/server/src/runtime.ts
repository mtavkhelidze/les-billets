import { BunRuntime } from "@effect/platform-bun";
import * as Effect from "effect/Effect";
import * as Logger from "effect/Logger";


export const runBunMain = <A, E>(effect: Effect.Effect<A, E>) => {
  BunRuntime.runMain(
    effect.pipe(
      Effect.catchAll(e => Effect.logFatal("Cannot continue", e)),
      Effect.catchAllDefect((error) => Effect.logFatal("Defect", error)),
    ),
    {
      disablePrettyLogger: false,
    }
  );
};
