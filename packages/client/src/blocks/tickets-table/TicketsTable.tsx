import { TicketRow } from "@blocks/tickets-table/TicketRow.tsx";
import * as Array from "effect/Array";
import * as React from "react";
import { type ChangeEventHandler, useEffect, useState } from "react";
import { Ticket } from "../../../../domain";

type Props = {
  tickets: readonly Ticket[];
}

const cellTitles = ["Title", "Description", "Created", "Updated", "Status"];
type SelectValueType = Ticket["status"] | "all";

const selectTicketsWith = (status: Ticket["status"]) =>
  Array.filter<Ticket>(t => t.status === status);

export const TicketsTable: React.FC<Props> = ({ tickets }) => {
  const [filter, setFilter] = useState<SelectValueType>("all");
  const [rows, setRows] = useState<readonly Ticket[]>(tickets);

  const setFilteredRows: ChangeEventHandler<HTMLSelectElement> = (e) => {
    setFilter(e.target.value as SelectValueType);
  };

  useEffect(() => {
    switch (filter) {
      case "closed":
      case "locked":
      case "open":
        return setRows(selectTicketsWith(filter)(tickets));
      default:
        return setRows(tickets);
    }
  }, [filter]);

  return (
    <table className="w-full border-collapse text-left">
      <thead className="text-xs text-gray-700 uppercase bg-gray-200">
      <tr>
        <th
          scope="row"
          colSpan={cellTitles.length}
          className="w-full bg-white text-right py-2 capitalize"
        >
          Show only
          <select
            onChange={setFilteredRows}
            className="ml-2 py-1 pl-2 pr-4 rounded text-gray-500 text-right border border-gray-300"
          >
            <option value="all">all</option>
            <option value="open">open</option>
            <option value="closed">closed</option>
            <option value="locked">locked</option>
          </select>
        </th>
      </tr>
      <tr className=" text-orange-700 text-lg">
        {cellTitles.map((name, index) => (
            <th className="py-3 pl-2" key={index}>
              <span className="flex flex-1 gap-0 items-center">
                {name}
              </span>
            </th>
          ),
        )}
      </tr>
      </thead>
      <tbody>
      {rows.map(row => (
          <TicketRow key={row.id} ticket={row} />
        ),
      )}
      </tbody>
    </table>
  );
};