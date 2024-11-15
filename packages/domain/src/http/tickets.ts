import * as S from "effect/Schema";
import { Ticket } from "../Ticket.ts";

export class TickersResponse
  extends S.Class<TickersResponse>("TickersResponse")(
    {
      tickets: S.Array(Ticket),
    },
  ) {}
