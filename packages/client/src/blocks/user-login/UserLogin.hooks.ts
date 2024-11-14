import { UserAuthService } from "@services/user_auth.ts";
import { pipe } from "effect";
import * as Effect from "effect/Effect";
import * as O from "effect/Option";
import { useState } from "react";

export const useUserLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<O.Option<string>>(O.none());

  const login = (email: string, password: string): Promise<void> => {
    return UserAuthService.runtime.runPromise(
      pipe(
        UserAuthService,
        Effect.tap(_ => {
          void setLoading(true);
          void setError(O.none());
        }),
        Effect.andThen(service => service.login(email, password)),
      ),
    ).catch(error => setError(O.some(error.message)))
      .then(() => setLoading(false));
  };

  return { error, loading, login };
};
