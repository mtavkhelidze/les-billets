import { appExecute } from "@lib/appExecute.ts";
import { UserProfileStoreService } from "@services/UserProfileStoreService.ts";
import { ManagedRuntime } from "effect";
import * as Effect from "effect/Effect";

export const runtime = ManagedRuntime.make(
  // Layer.mergeAll(
  UserProfileStoreService.live,
  // ),
);

export const StateRuntime = {
  execute:
    <A, E>(program: Effect.Effect<A, E, UserProfileStoreService>) =>
      appExecute("@my/client/state", runtime)(program),
};
