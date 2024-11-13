import React, { type PropsWithChildren } from "react";
import "./Button.css";

type Props = PropsWithChildren & {
  type?: "button" | "submit" | "reset";
  style?: "primary" | "secondary";
  disabled?: boolean;
};
export const Button: React.FC<Props> = (props) => {
  const {
    children,
    disabled,
    style = "primary",
    type = "button",
  } = props;
  return (
    <button
      type={type}
      disabled={disabled}
      className={`button-${style} ${disabled && "disabled"}`}
    >
      {children}
    </button>
  );
};
