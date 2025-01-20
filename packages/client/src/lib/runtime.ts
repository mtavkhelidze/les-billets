import { withLogLevel } from "@config";
import {
  UserAuthClient,
} from "@services";
import { TicketStoreService, UserProfileStoreService } from "@store";
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
