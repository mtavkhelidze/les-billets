import {
  HttpClient,
  HttpClientRequest,
  HttpClientResponse,
} from "@effect/platform";
import { Context, ManagedRuntime } from "effect";
import * as Data from "effect/Data";
import * as Effect from "effect/Effect";
import * as O from "effect/Option";
import * as Record from "effect/Record";
import { UserWithPassword } from "model";
import { LoginResponse } from "model/http";

class InvalidCredentialsError
  extends Data.TaggedError("InvalidCredentialsError")<{}> {
  override readonly message = "Invalid credentials.";
}

type UserAuthError = InvalidCredentialsError;

interface UserAuthClient {
  readonly login: (
    email: UserWithPassword["email"],
    password: UserWithPassword["password"],
  ) => Effect.Effect<O.Option<string>, UserAuthError>;
}

class UserAuthClientImpl implements UserAuthClient {
  // @misha: the other, hopefully proper way of doing what's in
  // UserChannelService
  constructor(
    private runtime: ManagedRuntime.ManagedRuntime<UserAuthService, never>,
    private client: HttpClient.HttpClient,
  ) {}

  public login = (
    email: UserWithPassword["email"],
    password: UserWithPassword["password"],
  ) =>
    HttpClientRequest.get("/user/login").pipe(
      this.client.execute,
      Effect.flatMap(HttpClientResponse.schemaBodyJson(LoginResponse)),
      Effect.map(Record.get("jwtToken")),
      Effect.catchAll(() => Effect.fail(new InvalidCredentialsError())),
      Effect.scoped,
    );
}

export class UserAuthService extends Context.Tag("UserAuthService")<
  UserAuthClient,
  UserAuthClientImpl
>() {}
