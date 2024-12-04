import { SqlClient } from "@effect/sql";
import { Ticket } from "@my/domain/model";
import { DataBaseDriver } from "@storage/DataBaseDriver.ts";
import { getTicketsQuery } from "@storage/queries/tickets.ts";
import { flow } from "effect";
import * as Context from "effect/Context";
import * as Data from "effect/Data";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";

class TicketStorageError extends Data.TaggedError("TicketStorageError")<{
  error: Error
}> {}

interface TicketStorage {
  readonly getTickets: () => Effect.Effect<readonly Ticket[], TicketStorageError>;
}

export class TicketStorageService extends Context.Tag("TicketStorage")<
  TicketStorageService, TicketStorage
>() {
  public static live = Layer.effect(
    TicketStorageService,
    SqlClient.SqlClient.pipe(
      Effect.andThen(sql => TicketStorageService.of({
          getTickets: flow(
            getTicketsQuery(sql),
            Effect.catchAll(e =>
              Effect.fail(new TicketStorageError({ error: e })).pipe(
                Effect.zipLeft(Effect.logError(e.toJSON())),
              ),
            ),
          ),
        }),
      ),
    ),
  );
}
