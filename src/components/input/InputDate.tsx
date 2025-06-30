import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import React, { useState } from "react";
import { Calendar } from "../ui/calendar";
import { useController, useFormContext } from "react-hook-form";

type InputDateProps = React.InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
  label?: string;
  maxDate?: Date;
  minDate?: Date;
  defaultDateValue?: string;
};

export function InputDate({ error, label, minDate, maxDate, defaultDateValue, ...props }: InputDateProps) {
  const { control } = useFormContext();
  const { field } = useController({ control, name: props.name || "" });
  const [openPopOver, setOpenPopOver] = useState(false);

  return (
    <div className={`w-full ${props.className}`}>
      {label && (
        <label className="block text-sm font-medium mb-1.5">
          {label}{" "}
          {props.required && (
            <span className="font-semibold text-danger">*</span>
          )}
        </label>
      )}
      <Popover open={openPopOver} onOpenChange={setOpenPopOver}>
        <PopoverTrigger asChild>
          <div
            className={`flex justify-between items-center border ${
              error ? "border-danger" : "border-primary-200"
            } rounded px-4 py-3 cursor-pointer hover:bg-gray-50`}
          >
            {field.value ? (
              format(field.value, "PPP")
            ) : (
              <span className="text-primary-500 font-medium text-sm">
                {props.placeholder}
              </span>
            )}
            <CalendarIcon color="#8C8C8C" size={20} />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-white" align="start">
          <Calendar
            mode="single"
            defaultDateValue={defaultDateValue}
            selected={field.value}
            onSelect={field.onChange}
            initialFocus
            maxDate={maxDate}
            minDate={minDate}
            closePopOver={() => setOpenPopOver(false)}
          />
        </PopoverContent>
      </Popover>
      {error && (
        <p className="text-red-500 text-xs font-medium mt-0.5">{error}</p>
      )}
    </div>
  );
}
