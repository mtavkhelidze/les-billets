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
}
export const LabelledInput =
  forwardRef((props: Props, ref: ForwardedRef<HTMLTextAreaElement>) => {
      const {
        autoComplete = "off",
        disabled,
        error = "",
        label,
        multiline = false,
        placeholder,
        required,
        ...rest
      } = props;

      return (
        <div className="labelled-input-group">
          <div className="input-group">
            <label className="text-gray-500" htmlFor={props.name} role="label">
              {label}
            </label>
            <textarea
              autoComplete={autoComplete}
              className="resize-none flex-1"
              disabled={disabled}
              placeholder={placeholder}
              ref={ref}
              required
              rows={multiline ? 4 : 1}
              {...rest}
            />
          </div>
          <div id="error" className={cx({ hidden: !error })}>{error}</div>
        </div>
      );
    },
  );
