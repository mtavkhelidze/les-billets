import { UserAuthClient } from "@services/UserAuthClient.ts";
import { UserProfileStoreService } from "@services/UserProfileStoreService.ts";
import { WebSuckerClient } from "@services/WebSuckerClient.ts";
import { ManagedRuntime } from "effect";
import * as Layer from "effect/Layer";

export const AppRuntime = ManagedRuntime.make(
  Layer.mergeAll(
    UserProfileStoreService.live,
    WebSuckerClient.live,
    UserAuthClient.live,
  ),
);
