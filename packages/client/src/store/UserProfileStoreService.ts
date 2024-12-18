import { UserProfile } from "@my/domain/model";
import { pipe } from "effect";
import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as O from "effect/Option";
import * as Stream from "effect/Stream";
import * as SRef from "effect/SubscriptionRef";

export interface UserProfileStore {
  readonly set: (profile: O.Option<UserProfile>) => Effect.Effect<void>;
  readonly stream: () => Stream.Stream<O.Option<UserProfile>>;
  readonly user: () => Effect.Effect<O.Option<UserProfile>>;
}

class UserProfileStoreImpl implements UserProfileStore {
  constructor(private wire: SRef.SubscriptionRef<O.Option<UserProfile>>) {
  }

  public set(profile: O.Option<UserProfile>) {
    return pipe(
      this.wire,
      SRef.set(profile),
    );
  }

  public stream = () => {
    return this.wire.changes;
  };

  public user = () => {
    return this.wire.pipe(
      SRef.get,
    );
  };
}

export class UserProfileStoreService extends Context.Tag(
  "UserProfileStoreService")<
  UserProfileStoreService,
  UserProfileStore
>() {
  public static layer = Layer.effect(
    UserProfileStoreService,
    SRef.make<O.Option<UserProfile>>(O.none())
      .pipe(
        Effect.map(ref => new UserProfileStoreImpl(ref)),
      ),
  );
}
