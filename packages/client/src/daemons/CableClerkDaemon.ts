import { ClientCable } from "@my/domain/http";
import { toJson } from "@my/domain/json";
import {
  ServerSocket,
  ServerSocketService,
  UserProfileStore,
  UserProfileStoreService,
} from "@services";
import { Console, pipe } from "effect";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Stream from "effect/Stream";

const cableToJson = toJson(ClientCable);

const tag = "@my/client/daemons/CableClerkDaemon";
const tagFor = (subTag: string) => tag + "/" + subTag;

interface CableClerk {
  readonly sendCable: (cable: ClientCable) => Effect.Effect<void>;
  readonly work: () => Effect.Effect<void, never, UserProfileStoreService>;
}

class CableClerkImpl implements CableClerk {
  constructor(
    private readonly serverSocket: ServerSocket,
    private readonly profileRef: UserProfileStore,
  ) {}

  public readonly sendCable = (cable: ClientCable) => {
    return cableToJson(cable).pipe(
      Effect.andThen(json => this.serverSocket.send(json)),
      Effect.catchAll(Effect.logDebug),
    );
  };
  public readonly work = () => {
    return UserProfileStoreService.pipe(
      Effect.andThen(store => store.stream()),
      Effect.andThen(Stream.runForEach(x => Console.log(`here ${x}`))),
    );
  };
}

export class CableClerkDaemon extends Effect.Tag(tag)<
  CableClerkDaemon,
  CableClerk
>() {
  public static layer = Layer.effect(
    CableClerkDaemon,
    pipe(
      Effect.all([ServerSocketService, UserProfileStoreService]),
      Effect.andThen(([serverSocket, profileStore]) => new CableClerkImpl(
        serverSocket,
        profileStore,
      )),
      Effect.provideServiceEffect(
        ServerSocketService,
        ServerSocketService.service,
      ),
    ),
  );
}
