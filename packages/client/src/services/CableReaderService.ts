import { GetTicketList } from "@my/domain/http";
import { UserProfile } from "@my/domain/model";
import { UserProfileStoreService } from "@services/UserProfileStoreService.ts";
import { WsClientService } from "@services/WSClient.ts";
import { Console, flow, pipe } from "effect";
import * as ConfigError from "effect/ConfigError";
import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as O from "effect/Option";
import * as Stream from "effect/Stream";

const extractToken = (profile: O.Option<UserProfile>) => pipe(
  profile,
  Effect.andThen(p => p.jwtToken),
);

const reader = WsClientService.pipe(
  Effect.andThen(client => client.messages.pipe(
      Stream.runForEach(Console.log),
    ),
  ),
);

const runner = flow(
  extractToken,
  Effect.flatMap(token => pipe(
      WsClientService,
      Effect.andThen(client =>
        client.connectWith(token).pipe(
          Effect.andThen(
            client.send(
              JSON.stringify(
                GetTicketList.make({}),
              ),
            ),
          ),
          Effect.andThen(reader),
        ),
      ),
      Effect.tap(Effect.log(`Connected to websocket.`)),
    ),
  ),
  Effect.catchTag("NoSuchElementException", () => pipe(
      WsClientService,
      Effect.andThen(ws => ws.cleanup()),
    ),
  ),
  Effect.catchAll(e => Effect.logError(`CableReader: ${e}`)),
  Effect.ignore,
  Effect.scoped,
);

const onProfile = (profile: O.Option<UserProfile>) =>
  WsClientService.pipe(
    Effect.andThen(client => client),
  );

class CableReaderDaemonImpl implements CableReader {
  public run = () => {
    return UserProfileStoreService.pipe(
      Effect.andThen(store => store.stream().pipe(
        Stream.runForEach(runner),
      )),
    );
  };
}

interface CableReader {
  readonly run: () => Effect.Effect<void, ConfigError.ConfigError, UserProfileStoreService | WsClientService>;
}

export class CableReaderDaemon extends Context.Tag("CableReaderDaemon")<
  CableReaderDaemon,
  CableReader
>() {
  public static live = Layer.succeed(
    CableReaderDaemon,
    new CableReaderDaemonImpl(),
  );
}
