import { type ClientCable, TicketList } from "../../../domain/src/dto";
import { CentralTelegraph } from "@services/TelegraphService.ts";
import { TicketStorageService } from "@storage";

import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";

const CableReaderId: unique symbol =
  Symbol.for("@my/server/services/CableReader");

export interface CableReader {
  processIncoming: (cable: ClientCable) => Effect.Effect<void, never, TicketStorageService | CentralTelegraph>;
}

export class CableReaderService extends Context.Tag(CableReaderId.toString())<
  CableReaderService, CableReader
>() {

  public static live = Layer.succeed(
    CableReaderService, CableReaderService.of({
      processIncoming: (cable: ClientCable) =>
        Effect.all([TicketStorageService, CentralTelegraph]).pipe(
          Effect.andThen(([db, tt]) =>
            db.getTickets().pipe(
              Effect.andThen(tickets => tt.send(TicketList.make({ tickets }))),
            ),
          ),
          Effect.ignoreLogged,
        ),
    }),
  );
}
