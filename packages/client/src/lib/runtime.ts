import { AppLogger } from "@lib/logger.ts";
import { UserAuthClient } from "@services/UserAuthClient.ts";
import { UserProfileStore } from "@services/UserProfileStore.ts";
import { WebSuckerClient } from "@services/WebSuckerClient.ts";
import { ManagedRuntime } from "effect";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import { RunForkOptions } from "effect/Runtime";

const runtime = ManagedRuntime.make(
  Layer.mergeAll(
    UserProfileStore.live,
    UserAuthClient.live,
    WebSuckerClient.live,
  ),
);

export const AppRuntime = {
  runPromise: <A, E>(
    self: Effect.Effect<A, E>,
    options?: {
      readonly signal?: AbortSignal | undefined
    },
  ) => runtime.runPromise(self.pipe(AppLogger), options),
  runFork: <A, E>(
    self: Effect.Effect<A, E>,
    options?: RunForkOptions,
  ) => runtime.runFork(self.pipe(AppLogger), options),
};


