import { FetchHttpClient } from "@effect/platform";
import { LoginRequest } from "@my/domain/http";
import type { InvalidCredentials } from "@my/domain/http/errors";
import { UserProfile } from "@my/domain/model";
import { ApiClient } from "@services/LesBilletsApiClient.ts";
import { UserWireService } from "@services/UserWireService.ts";
import { identity, ManagedRuntime } from "effect";
import * as Context from "effect/Context";
import * as Data from "effect/Data";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Match from "effect/Match";

export class UserAuthError extends Data.TaggedError("UserAuthError")<{
  readonly details: string;
}> {
  public readonly message = "Cannot process request.";
}

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
          Match.orElse(_ => new UserAuthError({ details: _._tag })),
        ),
      ),
    );

  constructor(private client: ApiClient) {}
}

export class UserAuthService extends Context.Tag("UserAuthService")<
  UserAuthService,
  UserAuthClient
>() {
  public static live = Layer.effect(
    UserAuthService,
    Effect.succeed(new UserAuthClientImpl(ApiClient)),
  );
}
