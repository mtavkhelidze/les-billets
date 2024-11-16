import * as S from "effect/Schema";
import { Ticket } from "../model";

export class TickersResponse
  extends S.Class<TickersResponse>("TickersResponse")(
    {
      tickets: S.Array(Ticket),
    },
  ) {}
