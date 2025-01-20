import { HttpApiBuilder } from "@effect/platform";
import { LesBilletsAPI } from "@my/domain/api";
import {
  InternalServerError,
  InvalidCredentials,
} from "@my/domain/http/errors";
import { SystemUser, UserProfile } from "@my/domain/model";
import { JwtBackend } from "@services/JwtBackend.ts";
import { UserStorageService } from "@storage";
import { pipe } from "effect";

import * as Effect from "effect/Effect";
import * as Match from "effect/Match";

const getJwtToken = (user: SystemUser) => pipe(
  JwtBackend,
  Effect.flatMap(JwtBackend => JwtBackend.create(user)),
  Effect.map(jwtToken => UserProfile.make({
    ...user,
    jwtToken,
  })),
  Effect.tapErrorTag("JwtInvalidSecret", Effect.logError),
);

export const UserController = HttpApiBuilder.group(
  LesBilletsAPI,
  "user",
  handlers =>
    handlers
      .handle("login", ({ payload }) => {
        return UserStorageService.pipe(
          Effect.andThen(storage => storage.findByCreds(payload)),
          Effect.flatMap(getJwtToken),
          Effect.mapError(e =>
            Match.value(e).pipe(
              Match.tags({
                JwtInvalidSecret: _ => new InternalServerError(),
              }),
              Match.orElse(() => new InvalidCredentials()),
            ),
          ),
        );
      }),
);
