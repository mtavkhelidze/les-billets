import { UserProfile } from "@my/domain/model";
import { pipe } from "effect";
import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as O from "effect/Option";
import * as Stream from "effect/Stream";
import * as SRef from "effect/SubscriptionRef";

interface UserProfileState {
  readonly set: (profile: O.Option<UserProfile>) => Effect.Effect<void>;
  readonly stream: () => Stream.Stream<O.Option<UserProfile>>;
  readonly user: () => Effect.Effect<O.Option<UserProfile>>;
}

export class UserProfileStoreImpl implements UserProfileState {
  constructor(private wire: SRef.SubscriptionRef<O.Option<UserProfile>>) {
  }

  public set(profile: O.Option<UserProfile>) {
    return pipe(
      this.wire,
      SRef.set(profile),
    );
  }

  public stream = () => this.wire.changes;

  public user = () => pipe(
    this.wire,
    SRef.get,
  );
}

export class UserProfileStore extends Effect.Tag(
  "UserProfileStore")<
  UserProfileStore,
  UserProfileState
>() {
  public static live = Layer.effect(
    UserProfileStore,
    SRef.make<O.Option<UserProfile>>(O.none())
      .pipe(
        Effect.map(ref => new UserProfileStoreImpl(ref)),
      ),
  );
}
