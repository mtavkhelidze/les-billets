import {
  HttpApiBuilder,
  HttpApiSwagger,
  HttpMiddleware,
  HttpServer,
} from "@effect/platform";
import { BunHttpServer } from "@effect/platform-bun";
import { ApiLive } from "@http";
import { JwtBackend } from "@services/JwtBackend.ts";
import { UserStorage } from "@storage";

import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import { serverPort } from "./src/config.ts";
import { bunRunProgram } from "./src/runtime.ts";

const program = serverPort.pipe(
  Effect.andThen(port =>
    HttpApiBuilder
      .serve(HttpMiddleware.logger)
      .pipe(
        Layer.provide(HttpApiSwagger.layer()),
        Layer.provide(HttpApiBuilder.middlewareOpenApi()),
        Layer.provide(ApiLive),
        Layer.provide(HttpApiBuilder.middlewareCors()),
        HttpServer.withLogAddress,
        Layer.provide(
          BunHttpServer.layer({ port }),
        ),
        Layer.provide(UserStorage.live),
        Layer.provide(JwtBackend.live),
        Layer.launch,
      ),
  ),
);

bunRunProgram(program);