import { HttpApiBuilder } from "@effect/platform";
import { LesBilletsAPI } from "@my/domain/api";
import { DataBaseDriver, TicketStorage } from "@storage";
import * as Layer from "effect/Layer";
import { AuthMiddlewareLive } from "./middleware/AuthMiddlewareLive.ts";
import { TicketController } from "./TicketsController.ts";
import { UserController } from "./UserController.ts";
import { WsController } from "./WsController.ts";

export const HttpControllersLive =
  HttpApiBuilder
    .api(LesBilletsAPI)
    .pipe(
      // УВАГА: For the love of God, don't sort this: order matters!
      Layer.provide(UserController),
      Layer.provide(TicketController),
      Layer.provide(WsController),
      Layer.provide(AuthMiddlewareLive),
      Layer.provide(TicketStorage.live),
    );
