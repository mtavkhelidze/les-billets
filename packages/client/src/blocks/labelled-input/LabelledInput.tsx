import cx from "clsx";
import React, { type ForwardedRef, forwardRef } from "react";
import "./LabelledInput.css";
import type { UseFormRegisterReturn } from "react-hook-form";

type Props = Omit<UseFormRegisterReturn<string>, "ref"> & {
  autoComplete?: React.HTMLInputAutoCompleteAttribute;
  disabled?: boolean;
  error: string | undefined;
  label: string;
  multiline?: boolean;
  placeholder?: string;
  required?: boolean;
  password?: boolean;
}
export const LabelledInput =
  forwardRef((props: Props, ref: ForwardedRef<HTMLElement>) => {
      const {
        autoComplete = "off",
        disabled,
        error = "",
        label,
        multiline = false,
        placeholder,
        required,
        password,
        ...rest
      } = props;

      const inputElement = password
        ? (
          <input
            autoComplete={autoComplete}
            className="resize-none flex-1"
            disabled={disabled}
            placeholder={placeholder}
            ref={ref as ForwardedRef<HTMLInputElement>}
            required
            type="password"
            {...rest}
          />
        )
        : (
          <textarea
            autoComplete={autoComplete}
            className="resize-none flex-1"
            disabled={disabled}
            placeholder={placeholder}
            ref={ref as ForwardedRef<HTMLTextAreaElement>}
            required
            rows={multiline ? 4 : 1}
            {...rest}
          />
        );
      return (
        <div className="labelled-input-group">
          <div className="input-group">
            <label
              className="text-gray-500 pt-1"
              htmlFor={props.name}
              role="label"
            >
              {label}
            </label>
            {inputElement}
          </div>
          <div id="error" className={cx({ hidden: !error })}>{error}</div>
        </div>
      );
    },
  );
