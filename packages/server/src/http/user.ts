import { API } from "@api";
import { InternalServerError, InvalidCredentials } from "@api/error";
import { UserProfile } from "@domain/model";
import { HttpApiBuilder } from "@effect/platform";
import { pipe } from "effect";
import * as Effect from "effect/Effect";
import * as Match from "effect/Match";
import * as O from "effect/Option";
import { JwtBackend, JwtInvalidSecret } from "../services/JwtBackend.ts";
import { UserStorage } from "../storage/UserStorage.ts";

const getJwtToken = (user: UserProfile) => pipe(
  JwtBackend,
  Effect.flatMap(be => be.create(user)),
  Effect.map(token => (
      { ...user, jwtToken: O.some(token) }
    ),
  ),
  Effect.tapErrorTag("JwtInvalidSecret", Effect.logError),
);

export const UserLive = HttpApiBuilder.group(
  API,
  "user",
  handlers => handlers
    .handle("login", ({ payload }) =>
      UserStorage.pipe(
        Effect.andThen(storage => storage.findByCreds(
          payload.email,
          payload.password,
        )),
        Effect.flatMap(getJwtToken),
        Effect.mapError(e =>
          Match.value(e).pipe(
            Match.tag("JwtInvalidSecret", () => new InternalServerError()),
            Match.orElse(() => new InvalidCredentials()),
          ),
        ),
      ),
    ),
);
