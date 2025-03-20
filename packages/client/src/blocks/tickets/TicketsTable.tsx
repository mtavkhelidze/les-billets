import { TableTitleRow } from "@blocks/tickets/TableTitleRow.tsx";
import { Ticket } from "@my/domain/model";
import * as React from "react";

import "./TicketsTable.css";
import { TicketRow } from "./TicketRow";

type Props = {
  tickets: readonly Ticket[];
}

export const TicketsTable: React.FC<Props> = ({ tickets }) => {
  return (
    <div className=" w-full ticket-table">
      <table className="table-auto text-left  w-full">
        <thead>
        <tr>
          <TableTitleRow />
        </tr>
        </thead>
        <tbody>
        {/*{tickets.map(t => <TicketRow key={t.id} ticket={t} />)}*/}
        </tbody>
      </table>
    </div>
  );
};


/*
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
 <SmallButton
 className="ml-2"
 onClick={() => undefined}
 >add</SmallButton>
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
 */
