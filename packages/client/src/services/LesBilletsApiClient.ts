import {
  FetchHttpClient,
  HttpApiClient,
  HttpClient,
  HttpClientRequest,
} from "@effect/platform";
import { LesBilletsAPI } from "@my/domain/api";
import * as Effect from "effect/Effect";
import { apiBase } from "../config.ts";

export const ApiClient =
  apiBase.pipe(
    Effect.andThen(apiBase => HttpApiClient.make(
        LesBilletsAPI,
        {
          baseUrl: apiBase,
          transformClient: HttpClient.mapRequest(
            HttpClientRequest.bearerToken("token"),
          ),
        },
      ).pipe(
        Effect.provide(FetchHttpClient.layer),
      ),
    ),
  );

export type ApiClient = typeof ApiClient;
