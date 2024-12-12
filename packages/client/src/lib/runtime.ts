import { withLogLevel } from "@config";
import {
  TicketStoreService,
  UserAuthClient,
  UserProfileStoreService,
} from "@services";
import { ManagedRuntime } from "effect";
import * as Layer from "effect/Layer";

const layers = Layer.mergeAll(
  withLogLevel,
  UserProfileStoreService.layer,
  TicketStoreService.layer,
  UserAuthClient.layer,
);

export const AppRuntime = ManagedRuntime
  .make(layers);
