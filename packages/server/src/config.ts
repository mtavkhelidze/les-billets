import * as Config from "effect/Config";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Logger from "effect/Logger";

export const dbFile = Config.string("DB_FILE")
  .pipe(Config.withDefault(":memory:"));

export const jwtSecret = Config.string("JWT_SECRET");

export const serverPort =
  Config
    .number("SERVER_PORT")
    .pipe(Config.withDefault(9090));

export const keepAliveInterval =
  Config.duration("KEEP_ALIVE_INTERVAL").pipe(
    Config.withDefault("3 seconds"),
  );

export const AppLogLevel = {
  layer: Layer.unwrapEffect(
    Config.logLevel("LOG_LEVEL").pipe(
      Effect.andThen(level => Logger.minimumLogLevel(level)),
    ),
  ),
};
