import { HttpApiBuilder } from "@effect/platform";
import { LesBilletsAPI } from "@my/domain/api";
import * as Layer from "effect/Layer";
import { AuthMiddlewareLive } from "./middleware/AuthMiddlewareLive.ts";
import { TicketController } from "./TicketsController.ts";
import { UserController } from "./UserController.ts";
import { WsController } from "./WsController.ts";

export const HttpControllersLive =
  HttpApiBuilder
    .api(LesBilletsAPI)
    .pipe(
      Layer.provide(UserController),
      Layer.provide(TicketController),
      Layer.provide(WsController),
      Layer.provide(AuthMiddlewareLive),
    );
