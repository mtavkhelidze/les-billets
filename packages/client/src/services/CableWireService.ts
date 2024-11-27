import { GetTicketList } from "@my/domain/http";
import { UserProfile } from "@my/domain/model";
import { UserWireService } from "@services/UserWireService.ts";
import { WsClientService } from "@services/WSClient.ts";
import { flow, pipe } from "effect";
import * as Effect from "effect/Effect";
import * as O from "effect/Option";
import * as Stream from "effect/Stream";

const extractToken = (profile: O.Option<UserProfile>) => pipe(
  profile,
  Effect.flatMap(p => p.jwtToken),
);

// make it a runner in 'runners' returning a promise
const cableReader = pipe(
  UserWireService,
  Effect.andThen(wire => wire.stream),
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

export const CableReaderLive = cableReader;
