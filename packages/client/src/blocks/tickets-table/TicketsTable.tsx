import { TicketRow } from "@blocks/tickets-table/TicketRow.tsx";
import { Ticket } from "@my/domain/model";
import * as Array from "effect/Array";
import * as Str from "effect/String";
import * as React from "react";
import { type ChangeEventHandler, useEffect, useState } from "react";

type Props = {
  tickets: readonly Ticket[];
}

const cellTitles = ["title", "description", "created", "updated", "status"];

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
      <thead className="text-xs text-gray-700 bg-gray-200">
      <tr>
        <th
          scope="row"
          colSpan={cellTitles.length}
          className="w-full bg-white py-2"
        >
          <div className="flex items-center justify-between">
            <h2 className="flex-1 text-lg">
              {Str.capitalize(filter)} Tickets
            </h2>
            <div>
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
            </div>
          </div>
        </th>
      </tr>
      <tr className=" text-gray-700 text-lg">
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
