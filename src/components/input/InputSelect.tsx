import { useController, useFormContext } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";



type InputSelectProps = React.InputHTMLAttributes<HTMLSelectElement> & {
  error?: string;
  label?: string;
  options?: { value: string; label: string }[];
  onValueChange?: (value: string) => void;
};

export function InputSelect({ label, onValueChange, ...props }: InputSelectProps) {
  const { control } = useFormContext();
  const { field, fieldState: { error } } = useController({ name: props.name || "", control });
  const handleChange = (value: string) => {
    field.onChange(value);
    onValueChange?.(value);
  }

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium mb-1.5">
          {label}{" "}
          {props.required && (
            <span className="font-semibold text-danger">*</span>
          )}
        </label>
      )}
      <Select onValueChange={handleChange} value={field.value} defaultValue={field.value}>
        <SelectTrigger error={error?.message} className={`w-full ${props.className}`}>
          <SelectValue defaultValue={field.value} placeholder={props.placeholder} />
        </SelectTrigger>
        <SelectContent>
          {props?.options?.map((option, idx) => (
            <SelectItem key={`${option.value}` + idx} value={option.value.toString()}>
              {option.label || "-"}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-danger text-xs font-medium mt-0.5">{error.message}</p>}
    </div>
  );
}