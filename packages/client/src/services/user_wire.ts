import { Context, ManagedRuntime, pipe, PubSub } from "effect";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as O from "effect/Option";
import * as Stream from "effect/Stream";
import { WebUser } from "model";
import { useEffect, useState } from "react";


class UserWireImpl {
  constructor(private wire: PubSub.PubSub<O.Option<WebUser>>) {}

  /**
   * Returns (scoped) stream of updates for your enjoyment.
   *
   * @note: this is exactly what SubscriptionRef is dooing under the hood.
   */
  public get stream() {
    return pipe(
      this.wire,
      Stream.fromPubSub<O.Option<WebUser>>,
    );
  }

  public update(ou: O.Option<WebUser>) {
    return pipe(
      this.wire,
      PubSub.publish(ou),
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
    PubSub.bounded<O.Option<WebUser>>(1).pipe(
      Effect.andThen(ps => new UserWireImpl(ps)),
    ),
  );

  public static runtime = ManagedRuntime.make(UserWireService.live);

  public static resetUser = () => {
    UserWireService.runtime.runPromise(
      UserWireService.pipe(
        Effect.andThen(uw => uw.update(O.none())),
      ),
    );
  };

  public static setUser = (user: WebUser): void => {
    UserWireService.runtime.runPromise(
      UserWireService.pipe(
        Effect.andThen(uw => uw.update(O.some(user))),
      ),
    );
  };
}

export const useUserWire = () => {
  const [user, setUser] = useState<O.Option<WebUser>>(O.none());

  // @misha: this can be moved into a static method of UserWireService
  // so the runtime is completely hidden from the user.
  const program = pipe(
    UserWireService,
    Effect.andThen(ch => ch.stream),
    Effect.andThen(
      Stream.runForEach(uo => {
        setUser(uo);
        return Effect.void;
      }),
    ),
    Effect.forever,
    Effect.ignore,
  );

  useEffect(() => {
    UserWireService
      .runtime
      .runPromise(program)
      .then(console.log)
      .catch(console.error);
  }, []);

  return {
    user,
    setUser: UserWireService.setUser,
  };
};
