import { HttpApiBuilder } from "@effect/platform";
import { LesBilletsAPI } from "@my/domain/api";
import {
  InternalServerError,
  InvalidCredentials,
} from "@my/domain/http/errors";
import { UserProfile } from "@my/domain/model";
import { JwtBackend } from "@services/JwtBackend.ts";
import { UserStorage } from "@storage";
import { pipe } from "effect";

import * as Effect from "effect/Effect";
import * as Match from "effect/Match";
import * as O from "effect/Option";

const getJwtToken = (user: UserProfile) => pipe(
  JwtBackend,
  Effect.flatMap(be => be.create(user)),
  Effect.map(token => (
      { ...user, jwtToken: O.some(token) }
    ),
  ),
  Effect.tapErrorTag("JwtInvalidSecret", Effect.logError),
);

export const UserController = HttpApiBuilder.group(
  LesBilletsAPI,
  "user",
  handlers => handlers
    .handle("login", ({ payload }) =>
      UserStorage.pipe(
        Effect.andThen(storage => storage.findByCreds(
          payload.email,
          payload.password,
        )),
        Effect.tap(Effect.log),
        Effect.flatMap(getJwtToken),
        Effect.mapError(e =>
          Match.value(e).pipe(
            Match.tag("JwtInvalidSecret", () => new InternalServerError()),
            Match.tag("InternalError", () => new InternalServerError()),
            Match.orElse(() => new InvalidCredentials()),
          ),
        ),
      ),
    ),
);
