import { apiBase } from "@config";
import {
  FetchHttpClient,
  HttpApiClient,
  HttpClient,
  HttpClientRequest,
} from "@effect/platform";
import { LesBilletsAPI } from "@my/domain/api";
import * as Effect from "effect/Effect";

export const ApiClient =
  apiBase.pipe(
    Effect.andThen(apiBase => HttpApiClient.make(
        LesBilletsAPI,
        {
          baseUrl: apiBase,
          transformClient: HttpClient.mapRequest(
            // HttpClientRequest.bearerToken("token"),
            HttpClientRequest.setHeader("Connection", "upgrade"),
          ),
        },
      ).pipe(
        Effect.provide(FetchHttpClient.layer),
      ),
    ),
  );

export type ApiClient = typeof ApiClient;
