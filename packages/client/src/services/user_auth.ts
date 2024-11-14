import { UserProfile } from "@domain/model";
import { LoginRequest, LoginResponse } from "@domain/model/http";
import {
  FetchHttpClient,
  HttpClient,
  HttpClientRequest,
  HttpClientResponse,
} from "@effect/platform";
import { ManagedRuntime, pipe } from "effect";
import * as Context from "effect/Context";
import * as Data from "effect/Data";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";

export interface UserAuthError {
  readonly message: string;
}

class UserAuthClient {
  // @misha: the other, hopefully proper way of doing what's in
  // UserChannelService
  constructor(private client: HttpClient.HttpClient) {}

  public login = (email: string, password: string) =>
    HttpClientRequest.schemaBodyJson(LoginRequest)(
      HttpClientRequest.post("/user/login"),
      { email, password },
    ).pipe(
      Effect.andThen(this.client.execute),
      Effect.flatMap(HttpClientResponse.schemaBodyJson(LoginResponse)),
      Effect.map(res => UserProfile.make(res)),
      Effect.catchAll(_ => Effect.fail(new InvalidCredentialsError())),
      Effect.scoped,
    );
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
};

