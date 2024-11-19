import type { ServerCable } from "@my/domain/http";
import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as PubSub from "effect/PubSub";
import * as Stream from "effect/Stream";

const TelegraphServiceId: unique symbol =
  Symbol.for("@my/server/services/TelegraphService");

type TelegraphServiceId = typeof TelegraphServiceId;

export interface TelegraphService {
  readonly [TelegraphServiceId]: TelegraphServiceId;
  readonly send: (cable: ServerCable) => Effect.Effect<boolean>;
  readonly wire: () => Stream.Stream<ServerCable>;
}

class TelegraphServiceImpl implements TelegraphService {
  public readonly [TelegraphServiceId]: TelegraphServiceId = TelegraphServiceId;
  public send = (cable: ServerCable) => this.teletype.publish(cable);
  public wire = () => this.teletype.pipe(
    Stream.fromPubSub<ServerCable>,
  );

  constructor(private readonly teletype: PubSub.PubSub<ServerCable>) {}
}

export class CentralTelegraph extends Context.Tag(
  TelegraphServiceId.toString(),
)<
  CentralTelegraph, TelegraphService
>() {
  public static live = Layer.effect(
    CentralTelegraph,
    PubSub.bounded<ServerCable>(1).pipe(
      Effect.map(ref => new TelegraphServiceImpl(ref)),
    ),
  );
}
