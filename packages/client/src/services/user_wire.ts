import { UserProfile } from "@my/domain/model";
import { Context, ManagedRuntime, pipe } from "effect";
import * as Effect from "effect/Effect";
import { constVoid } from "effect/Function";
import * as Layer from "effect/Layer";
import * as O from "effect/Option";
import * as Stream from "effect/Stream";
import * as SRef from "effect/SubscriptionRef";

import { useEffect, useState } from "react";

const dummyUser = UserProfile.make({
  email: "x@y.com",
  id: "23f6be43-4bdd-4116-ae4a-8b1203de1045",
  jwtToken: O.some("token"),
  name: "John Doe",
});

class UserWireImpl {
  constructor(private wire: SRef.SubscriptionRef<O.Option<UserProfile>>) {}

  /**
   * Returns (scoped) stream of updates for your enjoyment.
   *
   * @note: this is exactly what SubscriptionRef is dooing under the hood.
   */
  public get stream() {
    return this.wire.changes;
  }

  public set(profile: O.Option<UserProfile>) {
    return pipe(
      this.wire,
      SRef.set(profile),
    );
  }
}

/* @misha: This thing can be generalized to hold any type of value.

 This will be exactly the same what SubscriptionRef is
 doing, but with an isolated runtime, which is needed
 because, say in React, default runtime is not good enough.

 */
export class UserWireService extends Context.Tag("UserWireService")<
  UserWireService,
  UserWireImpl
>() {
  public static live = Layer.effect(
    UserWireService,
    SRef.make<O.Option<UserProfile>>(O.some(dummyUser))
      .pipe(
        Effect.map(ref => new UserWireImpl(ref)),
      ),
  );

  public static runtime = ManagedRuntime.make(UserWireService.live);

  public static setProfile = (profile: O.Option<UserProfile>): void => {
    UserWireService
      .runtime
      .runPromise(
        pipe(
          UserWireService,
          Effect.andThen(service => service.set(profile)),
        ),
      )
      .then(constVoid)
      .catch(console.error);
  };
}

export const useUserProfile = () => {
  const [profileState, setProfileState] = useState<O.Option<UserProfile>>(O.none());

  // @misha: this can be moved into a static method of UserWireService
  // so the runtime is completely hidden from the user.
  const monitorPofileStream = pipe(
    UserWireService,
    Effect.andThen(wire => wire.stream),
    Effect.andThen(
      Stream.runForEach(
        profile => Effect.succeed(void setProfileState(profile)),
      ),
    ),
    Effect.forever,
    Effect.ignore,
  );

  useEffect(() => {
    UserWireService
      .runtime
      .runPromise(monitorPofileStream)
      .then(console.log)
      .catch(console.error);
  }, []);

  return {
    profile: profileState,
  };
};
