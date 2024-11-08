import * as Config from "effect/Config";

export const serverPort =
  Config
    .number("SERVER_PORT")
    .pipe(Config.withDefault(9090));

export const logLevel =
  Config.logLevel("LOG_LEVEL")
    .pipe(Config.withDefault("info"));
