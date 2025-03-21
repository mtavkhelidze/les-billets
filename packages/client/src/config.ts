import { LogLevel } from "effect";
import * as Config from "effect/Config";
import * as ConfigProvider from "effect/ConfigProvider";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Logger from "effect/Logger";

export const apiBase = Config.string("API_BASE").pipe(
  Config.mapAttempt((_) => new URL(_)),
  Config.map((url) => url.href.replace(/\/$/, "")),
  Config.withDefault("http://localhost:9091"),
);

export const wsUrl = apiBase.pipe(
  Config.map(url => `${url}/ws`),
);

export const withLogLevel = Config.logLevel("LOG_LEVEL").pipe(
  Config.withDefault(process.env.NODE_ENV === "production"
    ? LogLevel.Error
    : LogLevel.All),
  Effect.andThen(level => Logger.minimumLogLevel(level)),
  Layer.unwrapEffect,
);

type DotEnvConfig = {
  env: {
    VITE_API_BASE: string;
    VITE_LOG_LEVEL: string;
    VITE_WS_URL: string;
  }
};

const EnvConfig: DotEnvConfig = {
  env: {
    VITE_API_BASE: (
      import.meta as unknown as DotEnvConfig
    ).env.VITE_API_BASE,
    VITE_LOG_LEVEL: (
      import.meta as unknown as DotEnvConfig
    ).env.VITE_LOG_LEVEL,
    VITE_WS_URL: (
      import.meta as unknown as DotEnvConfig
    ).env.VITE_WS_URL,
  },
};

export const ViteConfigProvider = ConfigProvider.fromMap(
  new Map(Object.entries(EnvConfig.env)),
  { pathDelim: "_", seqDelim: "," },
).pipe(
  ConfigProvider.nested("vite"),
  ConfigProvider.constantCase,
);
