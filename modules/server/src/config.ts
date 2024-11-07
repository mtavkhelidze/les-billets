import * as Config from "effect/Config";

export const wsPort = Config.number("WS_PORT").pipe(
  Config.withDefault(9090),
);

