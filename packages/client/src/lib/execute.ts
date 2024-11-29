import { LogLevel, ManagedRuntime } from "effect";
import * as Effect from "effect/Effect";
import * as Logger from "effect/Logger";
import { logLevel } from "../config.ts";

export const execute =
  <R>(tag: symbol, mr: ManagedRuntime.ManagedRuntime<R, never>) =>
    <A, E>(
      program: Effect.Effect<A, E, R>,
      signal?: AbortSignal,
    ): Promise<A | E> => {
      const prog = logLevel.pipe(
        Effect.andThen(level => {
          console.log(">>>>>", level);
          return program.pipe(
              Logger.withMinimumLogLevel(level),
              Effect.withSpan(`execute::${tag.toString()}`),
            )
          },
        ),
      );
      return mr.runPromise(prog, signal ? { signal } : undefined);
    };
