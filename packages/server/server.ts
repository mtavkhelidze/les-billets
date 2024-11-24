import {
  HttpApiBuilder,
  HttpApiSwagger,
  HttpMiddleware,
  HttpServer,
} from "@effect/platform";
import { BunHttpServer } from "@effect/platform-bun";
import { HttpControllersLive } from "@http";
import { CableReaderLive } from "@services/CableReader.ts";
import { JwtBackend } from "@services/JwtBackend.ts";
import { CentralTelegraph } from "@services/TelegraphService.ts";
import { UserStorageSqlLite } from "@storage";

import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import { serverPort } from "./src/config.ts";
import { bunRunProgram } from "./src/runtime.ts";

const httpServer = serverPort.pipe(
  Effect.andThen(port =>
    HttpApiBuilder
      .serve(HttpMiddleware.logger)
      .pipe(
        Layer.provide(HttpApiSwagger.layer()),
        Layer.provide(HttpApiBuilder.middlewareOpenApi()),
        Layer.provide(HttpControllersLive),
        Layer.provide(CentralTelegraph.live),
        Layer.provide(CableReaderLive),
        Layer.provide(HttpApiBuilder.middlewareCors()),
        HttpServer.withLogAddress,
        Layer.provide(BunHttpServer.layer({ port })),
        Layer.provide(UserStorageSqlLite),
        Layer.provide(JwtBackend.live),
        Layer.launch,
      ),
  ),
);

bunRunProgram(httpServer);
