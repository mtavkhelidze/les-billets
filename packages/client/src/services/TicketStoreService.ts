import { Ticket } from "@my/domain/model";
import { Console, flow } from "effect";
import * as A from "effect/Array";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Stream from "effect/Stream";
import * as SRef from "effect/SubscriptionRef";

const id = "@my/client/services/TicketStoreService";

const addOrReplace = (ticket: Ticket) => flow(
  A.filter<Ticket>(t => t.id === ticket.id),
  x => [ticket, ...x] as readonly Ticket[],
);


export interface TicketStore {
  readonly addOrReplace: (ticket: Ticket) => Effect.Effect<void>;
  readonly setAll: (tickets: readonly Ticket[]) => Effect.Effect<void>;
  readonly stream: () => Stream.Stream<readonly Ticket[]>;
}

class TicketStoreImpl implements TicketStore {
  public readonly setAll = (tickets: readonly Ticket[]) => {
    return this.tickets.pipe(
      SRef.set(tickets),
    );
  }

  public readonly addOrReplace = (ticket: Ticket) =>
    this.tickets.pipe(
      SRef.update(addOrReplace(ticket)),
      Effect.asVoid,
    );

  public readonly stream = () => this.tickets.changes;

  constructor(private tickets: SRef.SubscriptionRef<readonly Ticket[]>) {}
}

export class TicketStoreService extends Effect.Tag(id)<
  TicketStoreService,
  TicketStore
>() {
  public static layer = Layer.effect(
    TicketStoreService,
    SRef.make<readonly Ticket[]>([]).pipe(
      Effect.map(ref => new TicketStoreImpl(ref)),
    ),
  );
}
