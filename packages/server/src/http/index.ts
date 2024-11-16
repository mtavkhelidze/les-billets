import { HttpApiBuilder } from "@effect/platform";
import { LesBilletsAPI } from "@my/domain/api";
import { DatabaseDriver, TicketStorage } from "@storage";
import * as Layer from "effect/Layer";
import { AuthMiddlewareLive } from "./middleware/AuthMiddlewareLive.ts";
import { TicketController } from "./tickets_controller.ts";
import { UserController } from "./user_controller.ts";

export const ApiLive =
  HttpApiBuilder
    .api(LesBilletsAPI)
    .pipe(
      // For the love of God, don't sort this: order matters!
      Layer.provide(UserController),
      Layer.provide(TicketController),
      Layer.provide(AuthMiddlewareLive),
      Layer.provide(TicketStorage.live),
      Layer.provide(DatabaseDriver.live),
    );
