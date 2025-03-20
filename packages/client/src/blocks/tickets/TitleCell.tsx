import { ReactNode } from "react";

interface Props {
  id: string;
  title: ReactNode;
}

export const TitleCell = (props: Props) => {
  return (
    <th key={props.id}>
      <span className="font-bold">{props.title}</span>
    </th>
  );
};
