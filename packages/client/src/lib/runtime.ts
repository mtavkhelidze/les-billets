import { withLogLevel } from "@config";
import { CableClerkDaemon } from "@daemons";
import { UserAuthClient, UserProfileStore, ServerSocketService } from "@services";
import { ManagedRuntime } from "effect";
import * as Layer from "effect/Layer";

export const AppRuntime = ManagedRuntime.make(
  Layer.mergeAll(
    withLogLevel,
    UserProfileStore.live,
    UserAuthClient.live,
    ServerSocketService.live,
    CableClerkDaemon.live,
  ),
);
