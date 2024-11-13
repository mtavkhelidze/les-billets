import { LogLevel } from "effect";
import * as Effect from "effect/Effect";
import * as Logger from "effect/Logger";

export const execute = <A, E>(
  program: Effect.Effect<A, E>,
  signal?: AbortSignal,
): Promise<A | E> => {
  const prog = Effect.gen(function* (_) {
    return yield* program.pipe(
      Logger.withMinimumLogLevel(LogLevel.All),
      Effect.withLogSpan("execute"),
    );
  });
  return Effect.runPromise(prog, signal ? { signal } : undefined);
};
