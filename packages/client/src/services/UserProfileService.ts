import { UserProfile } from "@my/domain/model";
import { Context, pipe } from "effect";
import type { NoSuchElementException } from "effect/Cause";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as O from "effect/Option";
import * as Stream from "effect/Stream";
import * as SRef from "effect/SubscriptionRef";

interface UserProfileStore {
  readonly set: (profile: O.Option<UserProfile>) => Effect.Effect<void>;
  readonly stream: () => Stream.Stream<O.Option<UserProfile>>;
  readonly token: () => Effect.Effect<string, NoSuchElementException>;
  readonly user: () => Effect.Effect<O.Option<UserProfile>>;
}

export class UserProfileServiceImpl implements UserProfileStore {
  constructor(private wire: SRef.SubscriptionRef<O.Option<UserProfile>>) {}

  public user = () => pipe(
    this.wire,
    SRef.get,
  );

  public token() {
    return this.user().pipe(
      Effect.flatMap(O.flatMap(u => u.jwtToken)),
    );
  }

  public stream = () => this.wire.changes;

  public set(profile: O.Option<UserProfile>) {
    return pipe(
      this.wire,
      SRef.set(profile),
    );
  }
}

export class UserProfileService extends Effect.Tag("UserProfileService")<
  UserProfileService,
  UserProfileServiceImpl
>() {
  public static live = Layer.effect(
    UserProfileService,
    SRef.make<O.Option<UserProfile>>(O.none())
      .pipe(
        Effect.map(ref => new UserProfileServiceImpl(ref)),
      ),
  );
}