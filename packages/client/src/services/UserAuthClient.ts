import { LoginRequest } from "@my/domain/http";
import type { InvalidCredentials } from "@my/domain/http/errors";
import { UserProfile } from "@my/domain/model";
import { ApiClient } from "./LesBilletsApiClient";
import { identity } from "effect";
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

interface UserAuth {
  login: (
    email: string,
    password: string,
  ) => Effect.Effect<UserProfile, InvalidCredentials | UserAuthError>;
}

class UserAuthClientImpl implements UserAuth {
  public login = (email: string, password: string) =>
    this.client.pipe(
      Effect.andThen(api =>
        api.user.login({ payload: LoginRequest.make({ email, password }) }),
      ),
      Effect.map(res => UserProfile.make(res)),
      Effect.mapError(_ =>
        Match.value(_).pipe(
          Match.tag("InvalidCredentials", identity),
          Match.orElse(_ => new UserAuthError({ message: _.toString() })),
        ),
      ),
    );

  constructor(private client: ApiClient) {}
}

export class UserAuthClient extends Effect.Tag("UserAuthClient")<
  UserAuthClient,
  UserAuth
>() {
  public static layer = Layer.succeed(
    UserAuthClient,
    new UserAuthClientImpl(ApiClient),
  );
}
