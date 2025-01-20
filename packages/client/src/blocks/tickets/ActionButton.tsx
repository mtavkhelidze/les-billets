import { Button } from "@blocks/button";
import { Ticket } from "@my/domain/model";
import { flow } from "effect";
import * as Match from "effect/Match";

interface Props {
  status: Ticket["status"];
  onClick: () => void;
}

const statusToLabel = flow(
  Match.value<Ticket["status"]>,
  Match.when("open", () => "Edit"),
  Match.when("closed", () => "Re-Open"),
  Match.when("locked", () => "Unlock"),
  Match.exhaustive,
);

export const ActionButton = ({ status, onClick }: Props) => {
  return (
    <Button style="secondary" onClick={onClick}>{statusToLabel(status)}</Button>
  );
};
