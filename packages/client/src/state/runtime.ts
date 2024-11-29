import { appExecute } from "@lib/appExecute.ts";
import { UserProfileService } from "@services/UserProfileService.ts";
import { ManagedRuntime } from "effect";
import * as Effect from "effect/Effect";

export const runtime = ManagedRuntime.make(
  // Layer.mergeAll(
  UserProfileService.live,
  // ),
);

export const execute =
  <A, E>(program: Effect.Effect<A, E, UserProfileService>) =>
    appExecute("@my/client/state", runtime)(program);
