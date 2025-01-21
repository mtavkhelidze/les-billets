import { Ticket } from "@my/domain/model";
import * as Data from "effect/Data";

class TicketError extends Data.Error<{
  message: string;
  ticket: Ticket;
}> {};

export const useTicketOps = () => {
  const lockTicket = (t: Ticket): Promise<TicketError | void> => {
    return Promise.resolve(console.log(">>>> Log ticket", t));
  };

  const unlockTicket
};
