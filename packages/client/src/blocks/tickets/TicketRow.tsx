import { ActionButton } from "@blocks/tickets/ActionButton.tsx";
import { formatDistance, formatIso } from "@lib/datetime.ts";
import { Ticket } from "@my/domain/model";
import React from "react";

import "./TicketsTable.css";

type Props = {
  readonly ticket: Ticket;
  handleClick: () => void;
}

export const TicketRow: React.FC<Props> = ({ ticket }) => {
  const { title, createdAt, updatedAt, description, status } = ticket;
  return (
    <tr>
      <th
        scope="row"
        className="font-semibold text-gray-900 whitespace-nowrap"
      >
        {title}
      </th>
      <td>{description}</td>
      <td title={formatIso(createdAt)}>{formatDistance(createdAt)}</td>
      <td className="text-right">{status}</td>
      <td className="flex flex-row justify-end items-center">
        <ActionButton status={ticket.status} />
      </td>
    </tr>
  );
};
