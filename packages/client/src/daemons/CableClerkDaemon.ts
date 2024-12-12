import { ClientCable, GetTicketList, ServerCable } from "@my/domain/http";
import { fromJson, toJson } from "@my/domain/json";
import { UserProfile } from "@my/domain/model";
import {
  ServerSocket,
  ServerSocketService,
  TicketStore,
  TicketStoreService,
  UserProfileStore,
  UserProfileStoreService,
} from "@services";
import { Console, pipe } from "effect";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Match from "effect/Match";
import * as O from "effect/Option";
import * as Stream from "effect/Stream";

const cableToJson = toJson(ClientCable);
const cableFromJson = fromJson(ServerCable);

const tag = "@my/client/daemons/CableClerkDaemon";
const tagFor = (subTag: string) => tag + "/" + subTag;

interface CableClerk {
  readonly sendCable: (cable: ClientCable) => Effect.Effect<void>;
  readonly work: () => Effect.Effect<void, never, UserProfileStoreService>;
}

class CableClerkImpl implements CableClerk {
  public readonly sendCable = (cable: ClientCable) => {
    return cableToJson(cable).pipe(
      Effect.andThen(json => this.serverSocket.send(json)),
      Effect.catchAll(Effect.logDebug),
    );
  };
  public readonly work = () => {
    return UserProfileStoreService.pipe(
      Effect.andThen(store => store.stream()),
      Effect.andThen(
        Stream.runForEach(
          O.match({
            onSome: this.onUserIn,
            onNone: this.onUserOut,
          }),
        ),
      ),
      Effect.ignoreLogged,
    );
  };
  private dispatch = (cable: ServerCable) => Match.value(cable).pipe(
    Match.tag("TicketList", m => this.ticketStore.setAll(m.tickets)),
    Match.orElse(Console.log),
  );

  private onUserIn = (profile: UserProfile) => {
    return this.serverSocket.create(profile.jwtToken).pipe(
      Effect.andThen(
        Effect.all([
          this.sendCable(GetTicketList.make()),
          this.serverSocket.messages().pipe(
            Stream.flatMap(cableFromJson),
            Stream.runForEach(this.dispatch),
          ),
        ]),
      ),
    );
  };

  private onUserOut = () => {
    console.log("User is gone");
    return Effect.void;
  };

  constructor(
    private readonly serverSocket: ServerSocket,
    private readonly profileStore: UserProfileStore,
    private readonly ticketStore: TicketStore,
  ) {}
}

export class CableClerkDaemon extends Effect.Tag(tag)<
  CableClerkDaemon,
  CableClerk
>() {
  public static daemon = Layer.scopedDiscard(
    pipe(
      Effect.all([
        ServerSocketService,
        UserProfileStoreService,
        TicketStoreService,
      ]),
      Effect.andThen(([serverSocket, profileStore, ticketStore]) =>
        new CableClerkImpl(
          serverSocket,
          profileStore,
          ticketStore,
        ),
      ),
      Effect.andThen(daemon => daemon.work()),
      // @misha: each daemon gets its own socket, but store is shared app-wide
      Effect.provideServiceEffect(
        ServerSocketService,
        ServerSocketService.service,
      ),
    ),
  );
}
