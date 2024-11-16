import { UserAuthService } from "@services/UserAuthService.ts";
import { UserProfileService } from "@services/UserProfileService.ts";
import { pipe } from "effect";
import * as Effect from "effect/Effect";
import { constVoid } from "effect/Function";
import * as O from "effect/Option";
import { useState } from "react";

export const useUserLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<O.Option<string>>(O.none());

  const resetError = () => {
    setError(O.none());
  };

  const login = (email: string, password: string): Promise<void> => {
    return UserAuthService.runtime.runPromise(
      pipe(
        UserAuthService,
        Effect.tap(_ => {
          setError(O.none());
          void setLoading(true);
        }),
        Effect.andThen(service => service.login(email, password)),
        Effect.andThen(profile => pipe(
            UserProfileService,
            service => service.setProfile(O.some(profile)),
          ),
        ),
        Effect.tapError(e => {
          setError(O.some(e.message));
          return Effect.succeed(void setLoading(false));
        }),
        Effect.scoped,
      ),
    ).then(constVoid);
  };

  return { error, loading, login, resetError };
};
