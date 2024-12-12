import { ClientCable } from "@my/domain/http";
import { toJson } from "@my/domain/json";
import { ServerSocketService, UserProfileStore } from "@services";
import { Console } from "effect";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Stream from "effect/Stream";

const tag = "@my/client/daemons/CableClerkDaemon";
const tagFor = (subTag: string) => tag + "/" + subTag;

interface CableClerk {
  readonly sendCable: (cable: ClientCable) => Effect.Effect<void, never, ServerSocketService>
  readonly work: Effect.Effect<void, never, UserProfileStore>;
}

const cableToJson = toJson(ClientCable);

const sendCable = (cable: ClientCable): Effect.Effect<void, never, ServerSocketService> => {
  return cableToJson(cable).pipe(
    Effect.andThen(json => ServerSocketService.send(json)),
    Effect.catchAll(Effect.logError),
  );
};

const work: CableClerk["work"] =
  UserProfileStore.stream().pipe(
    Effect.andThen(
      Stream.runForEach(Console.log),
    ),
  );

export class CableClerkDaemon extends Effect.Tag(tag)<
  CableClerkDaemon,
  CableClerk
>() {
  public static live = Layer.effect(
    CableClerkDaemon,
    Effect.succeed(
      CableClerkDaemon.of({
        sendCable,
        work,
      }),
    ),
  );
}
