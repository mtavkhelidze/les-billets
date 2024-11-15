import * as DateTime from "effect/DateTime";
import React from "react";
import type { Ticket } from "../../../../domain";

import "./TableRow.css";

type Props = {
  readonly ticket: Ticket;
}

const utcToDateString = (utc: number) =>
  DateTime.unsafeMake(utc).pipe(
    DateTime.formatIsoDateUtc,
  );

export const TicketRow: React.FC<Props> = ({ ticket }) => {
  const { title, createdAt, updatedAt, description, status } = ticket;
  return (
    <tr
      className="
        table-row
        even:bg-gray-50
        even:border-t
        odd:bg-white
        "
    >
      <th
        scope="row"
        className="pl-2 font-semibold text-gray-900 whitespace-nowrap"
      >
        {title}
      </th>
      <td>{description}</td>
      <td>{utcToDateString(createdAt)}</td>
      <td>{updatedAt ? utcToDateString(updatedAt) : null}</td>
      <td>{status}</td>
    </tr>
  );
};
