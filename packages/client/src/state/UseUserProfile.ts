import { UserProfile } from "@my/domain/model";
import { UserAuthService } from "@services/UserAuthService.ts";
import { UserProfileStoreService } from "@services/UserProfileStoreService.ts";
import * as Effect from "effect/Effect";
import { constVoid } from "effect/Function";
import * as O from "effect/Option";
import * as Stream from "effect/Stream";
import { useEffect, useState } from "react";
import { StateRuntime } from "./runtime.ts";

export const useUserProfile = () => {
  const [error, setError] = useState<O.Option<Error>>(O.none());
  const [loading, setLoading] = useState(false);
  const [profileState, setProfileState] = useState<O.Option<UserProfile>>(O.none());

  const setUserProfile = (profile: O.Option<UserProfile>) =>
    Effect.succeed(setProfileState(profile));

  // region Helpers

  const begin = () => {
    setLoading(true);
    setError(O.none());
  };

  const endWith = (error: O.Option<Error>) => {
    setLoading(false);
    setError(error);
  };

  // endregion

  // region Effects

  const watchProfileStream =
    UserProfileStoreService.pipe(
      Effect.andThen(store => store.stream().pipe(
          Stream.runForEach(setUserProfile),
        ),
      ),
    );

  const loginEffect = (email: string, password: string) =>
    UserAuthService.pipe(
      Effect.andThen(auth => auth.login(email, password)),
      Effect.flatMap(profile => UserProfileStoreService.pipe(
          Effect.andThen(store => store.set(O.some(profile))),
        ),
      ),
      Effect.zipLeft(Effect.logDebug("Logged in.")),
      Effect.tapBoth({
        onSuccess: _ => Effect.void,
        onFailure: Effect.succeed,
      }),
    );

  // endregion

  // region Executors

  const resetError = () => endWith(O.none());

  const login = (email: string, password: string): Promise<void> => {
    begin();
    return StateRuntime.execute(
      loginEffect(email, password).pipe(
        Effect.provide(UserAuthService.live),
      ),
    ).catch(e => {
      endWith(O.some(e));
      throw e;
    }).then(_ => {
      endWith(O.none());
    });
  };

  const logout = () => {
    StateRuntime.execute(
      UserProfileStoreService.pipe(
        Effect.andThen(store => store.set(O.none()).pipe(
            Effect.zipLeft(Effect.logDebug("Logged out.")),
          ),
        ),
      ),
    )
      .then(constVoid)
      .catch(constVoid);
  };

  useEffect(() => {
    StateRuntime.execute(watchProfileStream)
      .catch(console.error)
      .then(constVoid);
  }, []);

  // endregion

  return {
    error,
    isError: O.isSome(error),
    isLoggedIn: O.isSome(profileState),
    loading,
    login,
    logout,
    profile: profileState,
    resetError,
  };
};
