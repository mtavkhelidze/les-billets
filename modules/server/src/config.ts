import * as Config from "effect/Config";

export const serverPort =
  Config
    .number("SERVER_PORT")
    .pipe(Config.withDefault(9090));
