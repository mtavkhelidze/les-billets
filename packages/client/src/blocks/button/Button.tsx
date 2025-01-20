import { DotsSpinner } from "@blocks/DotsSpinner.tsx";
import React, { type PropsWithChildren } from "react";
import "./Button.css";

type Props = PropsWithChildren & {
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  style?: "primary" | "secondary";
  type?: "button" | "submit" | "reset";
};
export const Button: React.FC<Props> = (props) => {
  const {
    children,
    disabled,
    loading = false,
    onClick,
    style = "primary",
    type = "button",
  } = props;
  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={`button-${style} ${disabled && "disabled"}`}
    >
      {loading ? <DotsSpinner fontSize={32} /> : children}
    </button>
  );
};
