import React from "react";
import { useFormContext, useController } from "react-hook-form";
import { InputDate } from "./InputDate";
import { InputSelect } from "./InputSelect";
import { InputTextArea } from "./InputTextArea";
import { InputPassword } from "./InputPassword";
import { InputText } from "./InputText";
import { InputFile } from "./InputFile";

// Base Input Props
type InputProps = {
  name: string;
  type:
    | "text"
    | "password"
    | "number"
    | "textarea"
    | "select"
    | "file"
    | "date";
  label?: string;
  options?: { value: string; label: string }[];
  placeholders?: string[];
  formatNumberSeparator?: boolean;
  showEyeIcon?: boolean;
  onValueChange?: (value: string) => void;
  ref?: any;
} & React.InputHTMLAttributes<HTMLInputElement> &
  React.TextareaHTMLAttributes<HTMLTextAreaElement> &
  React.SelectHTMLAttributes<HTMLSelectElement>;

export function Input(props: InputProps) {
  const { name, type, label, showEyeIcon, ...restProps } = props;
  const { control } = useFormContext();

  const {
    field,
    fieldState: { error },
  } = useController({
    control,
    name,
  });

  switch (type) {
    case "text":
    case "number":
      return (
        <InputText
          {...restProps}
          {...field}
          placeholders={
            (restProps.placeholders?.length || 0) > 0
              ? restProps.placeholders
              : [restProps.placeholder || ""]
          }
          error={error?.message}
          label={label}
          type={type}
        />
      );
    case "password":
      return (
        <InputPassword
          {...restProps}
          {...field}
          showEyeIcon={showEyeIcon}
          error={error?.message}
          label={label}
        />
      );
    case "date":
      return (
        <InputDate
          {...restProps}
          {...field}
          error={error?.message}
          label={label}
        />
      );
    case "textarea":
      return (
        <InputTextArea
          {...restProps}
          {...field}
          error={error?.message}
          label={label}
        />
      );
    case "select":
      return (
        <InputSelect
          options={restProps.options}
          {...restProps}
          {...field}
          label={label}
        />
      );
    case "file":
      return (
        <InputFile
          {...restProps}
          {...field}
          error={error?.message}
          label={label}
          ref={props.ref}
        />
      );
    default:
      return null;
  }
}
