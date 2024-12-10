import * as Logger from "effect/Logger";
import * as LogLevel from "effect/LogLevel";

export const AppLogger = Logger.withMinimumLogLevel(
  process.env.NODE_ENV === "development"
    ? LogLevel.All
    : LogLevel.None,
);
