import { GetTicketList } from "@my/domain/http";
import { UserProfile } from "@my/domain/model";
import { UserProfileService } from "@services/UserProfileService.ts";
import { WsClientService } from "@services/WSClient.ts";
import { Context, flow, pipe } from "effect";
import * as ConfigError from "effect/ConfigError";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as O from "effect/Option";
import * as Stream from "effect/Stream";

const extractToken = (profile: O.Option<UserProfile>) => pipe(
  profile,
  Effect.flatMap(p => p.jwtToken),
);

class CableReaderDaemonImpl implements CableReader {
  public run = () => pipe(
    UserProfileService,
    Effect.andThen(wire => wire.stream()),
    Effect.andThen(
      Stream.runForEach(flow(
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
        ),
      ),
    ),
    Effect.withLogSpan("CableReader"),
    Effect.scoped,
  );
}

interface CableReader {
  readonly run: () => Effect.Effect<void, ConfigError.ConfigError, UserProfileService | WsClientService>;
}

export class CableReaderDaemon extends Context.Tag("CableReaderService")<
  CableReader,
  CableReaderDaemonImpl
>() {
  public static live = Layer.succeed(
    CableReaderDaemon,
    new CableReaderDaemonImpl(),
  );
};
