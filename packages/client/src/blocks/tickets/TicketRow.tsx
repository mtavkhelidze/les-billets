import { formatDistance, formatIso } from "@lib/datetime.ts";
import { Ticket } from "@my/domain/model";
import * as DateTime from "effect/DateTime";
import React from "react";

import "./TicketTable.css";

type Props = {
  readonly ticket: Ticket;
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
    </tr>
  );
};
