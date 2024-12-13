import { AppRuntime } from "@lib/runtime.ts";
import { tagWith } from "@lib/tag.ts";
import { UserProfile } from "@my/domain/model";
import { UserAuthClient } from "@services";
import { UserProfileStoreService } from "@store";
import * as Effect from "effect/Effect";
import * as O from "effect/Option";
import * as Stream from "effect/Stream";
import { useEffect, useState } from "react";

const tag = tagWith("useUserProfile");

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
      Effect.andThen(store => store.stream()),
      Effect.andThen(Stream.runForEach(setUserProfile)),
    );

  const loginEffect = (email: string, password: string) =>
    UserAuthClient.pipe(
      Effect.andThen(auth => auth.login(email, password)),
      Effect.flatMap(profile => UserProfileStoreService.pipe(
          Effect.andThen(store => store.set(O.some(profile))),
        ),
      ),
      Effect.zipLeft(Effect.logDebug("Logged in.")),
      Effect.withLogSpan(tag("loginEffect")),
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
    return AppRuntime.runPromise(
      loginEffect(email, password),
    ).catch(e => {
      endWith(O.some(e));
      throw e;
    }).then(_ => {
      endWith(O.none());
    });
  };

  const logout = () => {
    void AppRuntime.runPromise(
      UserProfileStoreService.pipe(
        Effect.andThen(store => store.set(O.none()).pipe(
            Effect.zipLeft(Effect.logDebug("Logged out.")),
            Effect.withLogSpan(tag("logout")),
          ),
        ),
      ),
    );
  };

  useEffect(() => {
    void AppRuntime.runPromise(watchProfileStream);
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
