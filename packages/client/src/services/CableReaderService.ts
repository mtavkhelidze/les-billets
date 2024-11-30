import { GetTicketList } from "@my/domain/http";
import { UserProfile } from "@my/domain/model";
import { UserProfileService } from "@services/UserProfileService.ts";
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
  Effect.flatMap(p => p.jwtToken),
);

const runner = flow(
  extractToken,
  Effect.flatMap(token => pipe(
      WsClientService,
      Effect.andThen(client =>
        client.connectWith(token).pipe(
          Effect.andThen(client.send(GetTicketList.make({}).toString())),
        ),
      ),
      Effect.tap(Effect.log(`Connected to websocket.`)),
    ),
  ),
  Effect.catchTag("NoSuchElementException", () => pipe(
      WsClientService,
      Effect.andThen(ws => ws.close()),
    ),
  ),
  Effect.catchAll(e => Effect.logError(`CableReader: ${e}`).pipe(
    Effect.zipRight(Effect.void),
  )),
);

class CableReaderDaemonImpl implements CableReader {
  public run = () => {
    return UserProfileService.pipe(
      Effect.andThen(store => store.stream().pipe(
        Stream.runForEach(Console.log),
      )),
    );
  };
}

interface CableReader {
  readonly run: () => Effect.Effect<void, ConfigError.ConfigError, UserProfileService | WsClientService>;
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
