import { HttpControllersLive } from "@controllers";
import {
  HttpApiBuilder,
  HttpApiSwagger,
  HttpMiddleware,
  HttpServer,
} from "@effect/platform";
import { BunHttpServer } from "@effect/platform-bun";
import { CableReaderService } from "@services/CableReader.ts";
import { JwtBackend } from "@services/JwtBackend.ts";
import { CentralTelegraph } from "@services/TelegraphService.ts";
import { TicketStorageService, UserStorageService } from "@storage";
import { DataBaseDriver } from "@storage/DataBaseDriver.ts";

import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import { serverPort } from "./src/config.ts";
import { bunRunProgram } from "./src/runtime.ts";

const httpServer = serverPort.pipe(
  Effect.andThen(port =>
    HttpApiBuilder
      .serve(HttpMiddleware.logger)
      .pipe(
        HttpServer.withLogAddress,
        Layer.provide(BunHttpServer.layer({ port })),
        Layer.provide(HttpApiSwagger.layer()),
        Layer.provide(HttpApiBuilder.middlewareOpenApi()),
        Layer.provide(HttpApiBuilder.middlewareCors()),
        Layer.provide(HttpControllersLive),
        Layer.provide(CentralTelegraph.live),
        Layer.provide(CableReaderService.live),
        Layer.provide(UserStorageService.live),
        Layer.provide(TicketStorageService.live),
        Layer.provide(DataBaseDriver.live),
        Layer.provide(JwtBackend.live),
        Layer.launch,
      ),
  ),
);

bunRunProgram(httpServer);
