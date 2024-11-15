import { API } from "@api";
import { HttpApiBuilder } from "@effect/platform";
import { DatabaseDriver, TicketStorage } from "@storage";
import * as Layer from "effect/Layer";
import { Authentication } from "./middleware/authentication.ts";
import { TicketController } from "./tickets_controller.ts";
import { UserController } from "./user_controller.ts";

export const ApiLive =
  HttpApiBuilder
    .api(API)
    .pipe(
      // For the love of God, don't sort this: order matters!
      Layer.provide(UserController),
      Layer.provide(TicketController),
      Layer.provide(Authentication.middleware),
      Layer.provide(TicketStorage.live),
      Layer.provide(DatabaseDriver.live),
    );

