import { withLogLevel } from "@config";
import { CableClerkDaemon } from "@daemons";
import { UserAuthClient, UserProfileStoreService } from "@services";
import { ManagedRuntime } from "effect";
import * as Layer from "effect/Layer";

const layers = Layer.mergeAll(
  withLogLevel,
  UserProfileStoreService.layer,
  UserAuthClient.layer,
);

export const AppRuntime = ManagedRuntime
  .make(layers);
