import React, { type PropsWithChildren } from "react";

type Props = PropsWithChildren & {
  onClick: () => void;
  className?: string;
}
export const SmallButton: React.FC<Props> = props => {
  return (
    <span
      className={
        `px-1 text-xs font-light border border-orange-500 border-1 rounded cursor-pointer hover:border-gray-500 hover:text-orange-500
      ${props.className ?? ""}`
      }
      onClick={(_) => props.onClick()}
    >
      {props.children}
    </span>
  );
};
