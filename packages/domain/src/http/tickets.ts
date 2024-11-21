import * as S from "effect/Schema";
import { Ticket } from "../model";

export class TicketsResponse
  extends S.TaggedClass<TicketsResponse>("@my/domain/tickets/TicketsResponse")(
    "TicketsResponse", { tickets: S.Array(Ticket) },
  ) {}
