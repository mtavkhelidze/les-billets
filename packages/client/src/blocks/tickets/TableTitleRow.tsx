import { TitleCell } from "@blocks/tickets/TitleCell.tsx";
import * as React from "react";

export const TableTitleRow = () => {
  return (
    <>
      <TitleCell id="title" title="Title" />
      <TitleCell id="description" title="Description" />
      <TitleCell id="createdAt" title="Created At" />
      <TitleCell id="status" title="Status" />
      <TitleCell id="actions" title=""></TitleCell>
    </>
  );
};
