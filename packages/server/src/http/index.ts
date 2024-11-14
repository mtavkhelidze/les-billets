import { API } from "@api";
import { HttpApiBuilder } from "@effect/platform";
import * as Layer from "effect/Layer";
import { UserLive } from "./user.ts";

export const ApiLive =
  HttpApiBuilder
    .api(API)
    .pipe(
      Layer.provide(UserLive),
    );

