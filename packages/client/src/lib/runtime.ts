import { withLogLevel } from "@config";
import { UserAuthClient } from "@services/UserAuthClient.ts";
import { UserProfileStore } from "@services/UserProfileStore.ts";
import { WebSuckerClient } from "@services/WebSuckerClient.ts";
import { ManagedRuntime } from "effect";
import * as Layer from "effect/Layer";

export const AppRuntime = ManagedRuntime.make(
  Layer.mergeAll(
    withLogLevel,
    UserProfileStore.live,
    UserAuthClient.live,
    WebSuckerClient.live,
  ),
);
