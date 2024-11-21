import { LoginRequest } from "@my/domain/http";
import type { InvalidCredentials } from "@my/domain/http/errors";
import { UserProfile } from "@my/domain/model";
import { ApiClient } from "@services/LesBilletsApiClient.ts";
import { identity } from "effect";
import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Match from "effect/Match";
import * as Schema from "effect/Schema";

export class UserAuthError extends Schema.TaggedError<UserAuthError>()(
  "UserAuthError",
  {
    message: Schema.String,
  },
) {}

interface UserAuthClient {
  login: (
    email: string,
    password: string,
  ) => Effect.Effect<UserProfile, InvalidCredentials | UserAuthError>;
}

class UserAuthClientImpl implements UserAuthClient {
  public login = (email: string, password: string) =>
    this.client.pipe(
      Effect.andThen(api =>
        api.user.login({ payload: LoginRequest.make({ email, password }) }),
      ),
      Effect.map(res => UserProfile.make(res)),
      Effect.mapError(_ =>
        Match.value(_).pipe(
          Match.tag("InvalidCredentials", identity),
          Match.orElse(_ => new UserAuthError({ message: _._tag })),
        ),
      ),
    );

  constructor(private client: ApiClient) {}
}

export class UserAuthService extends Context.Tag("UserAuthService")<
  UserAuthService,
  UserAuthClient
>() {
  public static live = Layer.succeed(
    UserAuthService,
    new UserAuthClientImpl(ApiClient),
  );
}
