import { Ticket } from "@my/domain/model";
import cx from "clsx";
import React from "react";

type Props = {
  defaultChecked?: boolean;
  id: string;
  name: string;
  disabled?: boolean;
  onChange?: () => void;
  label: string
  value: Ticket["status"];
}
export const RadioButton: React.FC<Props> = props => {
  return (
    <div className="flex gap-1 items-start">
      <div className="grid place-items-center mt-1">
        <input
          type="radio"
          id={props.id}
          name={props.name}
          defaultChecked={props.defaultChecked}
          disabled={props.disabled}
          className="
          peer
          col-start-1 row-start-1
          appearance-none shrink-0
          w-4 h-4 border-2 border-orange-500 rounded-full
          focus:outline-none focus:ring-offset-0 focus:ring-2 focus:ring-orange-400
          disabled:border-gray-400
        "
          onChange={props.onChange}
          value={props.value}
        />
        <div
          className={cx(
            "pointer-events-none",
            "col-start-1 row-start-1",
            "w-2 h-2 rounded-full peer-checked:bg-orange-500",
            "peer-checked:peer-disabled:bg-gray-400",
          )}
        />
      </div>
      <label
        htmlFor={props.id}
        className={cx(
          "text-sm text-start hover:cursor-pointer",
          {
            "text-gray-400": props.disabled,
          },
        )}
      >
        {props.label}
      </label>
    </div>
  )
    ;
};
