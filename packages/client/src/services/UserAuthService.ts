import {
  FetchHttpClient,
  HttpClient,
  HttpClientRequest,
  HttpClientResponse,
} from "@effect/platform";
import { LoginRequest, LoginResponse } from "@my/domain/http";
import { InvalidCredentials } from "@my/domain/http/errors";
import { UserProfile } from "@my/domain/model";
import { ManagedRuntime, pipe } from "effect";
import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";

export interface UserAuthError {
  readonly message: string;
}

class UserAuthClient {
  // @misha: the other, hopefully proper way of doing what's in
  public login = (email: string, password: string) =>
    HttpClientRequest.schemaBodyJson(LoginRequest)(
      HttpClientRequest.post("/user/login"),
      { email, password },
    ).pipe(
      Effect.andThen(this.client.execute),
      Effect.flatMap(HttpClientResponse.schemaBodyJson(LoginResponse)),
      Effect.map(res => UserProfile.make(res)),
      Effect.mapError(e => new InvalidCredentials({ message: e.toString() })),
      Effect.scoped,
    );

  constructor(private client: HttpClient.HttpClient) {}
}

export class UserAuthService extends Context.Tag("UserAuthService")<
  UserAuthService,
  UserAuthClient
>() {
  public static live = pipe(
    HttpClient.HttpClient,
    Effect.map(HttpClient.filterStatusOk),
    Effect.map(
      HttpClient.mapRequest(
        HttpClientRequest
          .prependUrl("https://example.com"),
      ),
    ),
    Effect.map(client => new UserAuthClient(client)),
    Layer.effect(UserAuthService),
  );

  public static runtime = ManagedRuntime.make(
    UserAuthService.live.pipe(
      Layer.provide(FetchHttpClient.layer),
    ),
  );
}

