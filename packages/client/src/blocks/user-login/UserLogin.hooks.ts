import { UserAuthService } from "@services/UserAuthService.ts";
import { UserWireService } from "@services/UserWireService.ts";
import { pipe } from "effect";
import * as Effect from "effect/Effect";
import * as O from "effect/Option";
import { useState } from "react";

export const useUserLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<O.Option<Error>>(O.none());

  const begin = () => {
    setLoading(true);
    setError(O.none());
  };

  const endWith = (error: O.Option<Error>) => {
    setLoading(false);
    setError(error);
  };

  const resetError = () => {
    setError(O.none());
  };

  const login = (email: string, password: string) =>
    Effect.runPromise(
      loginEffect(email, password).pipe(
        Effect.provide(UserAuthService.live),
      )
    ).catch(_ => endWith(O.some(_)));

  const loginEffect = (email: string, password: string) =>
    UserAuthService.pipe(
      Effect.tap(begin),
      Effect.andThen(service => service.login(email, password)),
      Effect.andThen(profile => pipe(
          UserWireService,
          service => service.setProfile(O.some(profile)),
        ),
      ),
      Effect.tapBoth({
        onSuccess: _ => Effect.void,
        onFailure: Effect.succeed
      }),
    )
  ;

  return { error, loading, login, resetError };
};
