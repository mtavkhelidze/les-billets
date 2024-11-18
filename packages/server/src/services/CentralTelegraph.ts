import type { ServerCable } from "@my/domain/http";
import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as PubSub from "effect/PubSub";
import * as Stream from "effect/Stream";

export const TelegraphServiceId: unique symbol =
  Symbol.for("@my/services/CentralTelegraph");

export type TelegraphServiceId = typeof TelegraphServiceId;

export interface TelegraphService {
  readonly [TelegraphServiceId]: TelegraphServiceId;
  readonly send: (cable: ServerCable) => Effect.Effect<boolean>;
  readonly wire: () => Stream.Stream<ServerCable>;
}

class TelegraphServiceImpl implements TelegraphService {
  constructor(private readonly teletype: PubSub.PubSub<ServerCable>) {}

  public readonly [TelegraphServiceId]: TelegraphServiceId = TelegraphServiceId;
  public send = (cable: ServerCable) => this.teletype.publish(cable);
  public wire = () => this.teletype.pipe(
    Stream.fromPubSub<ServerCable>,
  );
  //   Effect.flatMap(identity),
  //   Effect.scoped,
  //   Stream.fromEffect,
  //   Stream.forever,
  // );
}

export class CentralTelegraph extends Context.Tag(
  "@my/services/CentralTelegraph")<
  CentralTelegraph, TelegraphService
>() {
  public static live = Layer.effect(
    CentralTelegraph,
    PubSub.bounded<ServerCable>(1).pipe(
      Effect.map(ref => new TelegraphServiceImpl(ref)),
    ),
  );
}
