import { execute } from "@lib/execute.ts";
import { UserProfileService } from "@services/UserProfileService.ts";
import { ManagedRuntime } from "effect";
import * as Effect from "effect/Effect";

export const stateRuntime = ManagedRuntime.make(
  // Layer.mergeAll(
  UserProfileService.live,
  // ),
);

export const stateExecute =
  <A, E>(program: Effect.Effect<A, E, UserProfileService>) =>
    execute(Symbol.for("@my/client/state"), stateRuntime)(program);
