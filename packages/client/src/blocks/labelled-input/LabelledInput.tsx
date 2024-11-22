import React from "react";
import cx from "clsx";
import "./LabelledInput.css";

type Props = {
  autoComplete?: React.HTMLInputAutoCompleteAttribute;
  disabled?: boolean;
  id: string;
  label: string;
  multiline?: boolean;
  placeholder?: string;
  error?: string;
}
export const LabelledInput: React.FC<Props> = props => {
  const {
    autoComplete = "off",
    disabled,
    error = "",
    id,
    label,
    multiline = false,
    placeholder,
  } = props;
  return (
    <div className="labelled-input-group">
      <div className="input-group">
        <label className="text-gray-500" htmlFor={id} role="label">
          {label}
        </label>
        <textarea
          rows={multiline ? 4 : 1}
          className="resize-none flex-1"
          autoComplete={autoComplete}
          disabled={disabled}
          id={id}
          placeholder={placeholder}
          //  {...register("title")}
        />
      </div>
      <div id="error" className={cx({ hidden: !error })}>{error}</div>
    </div>
  );
};
