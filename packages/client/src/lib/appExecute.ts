import { ManagedRuntime } from "effect";
import * as Effect from "effect/Effect";
import * as Logger from "effect/Logger";
import { withLogLevel } from "@config";

export const appExecute =
  <R>(tag: string, mr: ManagedRuntime.ManagedRuntime<R, never>) =>
    <A, E>(
      program: Effect.Effect<A, E, R>,
      signal?: AbortSignal,
    ): Promise<A | E> => {
      const prog = withLogLevel.pipe(
        Effect.andThen(level => program.pipe(
            Logger.withMinimumLogLevel(level),
            Effect.withLogSpan(`execute::${tag}`),
            // Effect.withConfigProvider(ViteConfigProvider),
          ),
        ),
      );
      return mr.runPromise(prog, signal ? { signal } : undefined);
    };
