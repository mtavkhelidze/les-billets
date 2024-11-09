import * as Config from "effect/Config";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Logger from "effect/Logger";
import * as LogLevel from "effect/LogLevel";

export const serverPort =
  Config
    .number("SERVER_PORT")
    .pipe(Config.withDefault(9090));

export const logLevel =
  Config.logLevel("LOG_LEVEL")

export const logLevelLayer = Layer.unwrapEffect(
  logLevel.pipe(
    Effect.andThen(level => Logger.minimumLogLevel(level)),
  ),
);
