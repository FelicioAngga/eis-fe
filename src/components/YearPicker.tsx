import React, { useEffect, useState } from "react";
import { useFormContext, useController } from "react-hook-form";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";

interface YearPickerProps {
  name: string;
  minYear?: number;
  maxYear?: number;
  label?: string;
  required?: boolean;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export const YearPicker: React.FC<YearPickerProps> = ({
  name,
  minYear = 0,
  maxYear = new Date().getFullYear() + 1000,
  label,
  required,
  placeholder = "Select year",
  value: propValue,
  onChange: propOnChange,
}) => {
  const [open, setOpen] = useState(false);
  const [startYear, setStartYear] = useState(Math.floor(new Date().getFullYear() / 10) * 10);

  let fieldValue = propValue;
  let fieldOnChange = propOnChange;
  let errorMessage: string | undefined = "";
  try {
    const { control } = useFormContext();
    const {
      field: { value, onChange },
      fieldState: { error },
    } = useController({ name, control });
    fieldValue = value;
    fieldOnChange = onChange;
    errorMessage = error?.message;
  } catch {}

  const years = Array.from({ length: 12 }, (_, i) => startYear - 1 + i);

  const handleSelectYear = (year: number) => {
    fieldOnChange?.(String(year));
    setOpen(false);
  };

  useEffect(() => {
    if (fieldValue && +fieldValue < minYear) fieldOnChange?.(String(minYear));
  }, [minYear])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className="w-full">
        <p className="font-medium text-sm mb-1.5">{label} {required && <span className="text-danger">*</span>}</p>
        <PopoverTrigger asChild>
          <div>
            <div className={`flex justify-between w-full border px-4 py-3 rounded font-medium text-sm cursor-pointer
            ${errorMessage ? "border-danger" : "border-gray-300"}
            ${fieldValue ? "text-primary" : "text-primary-500"}`}>
              {fieldValue || placeholder}
              <CalendarIcon color="#8C8C8C" size={20} />
            </div>
            {errorMessage && <p className="text-danger text-xs font-medium mt-0.5">{errorMessage}</p>}
          </div>
        </PopoverTrigger>
        <PopoverContent className="bg-white">
          <div className="mt-1">
            <div className="flex justify-between items-center mb-2">
              <button
                type="button"
                onClick={() => setStartYear((y) => y - 10)}
                className="text-sm px-2 cursor-pointer"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-sm font-medium">
                {startYear - 1} - {startYear + 10}
              </span>
              <button
                type="button"
                onClick={() => setStartYear((y) => y + 10)}
                className="text-sm px-2 cursor-pointer"
              >
                <ChevronRight size={16} />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {years.map((year) => (
                <button
                  key={year}
                  type="button"
                  disabled={year < minYear || year > maxYear}
                  onClick={() => handleSelectYear(year)}
                  className={`text-sm px-3 py-4 2xl:py-5 rounded-md cursor-pointer ${
                    String(year) === fieldValue
                      ? "bg-black text-white"
                      : "hover:bg-gray-100"
                  } ${year < minYear ? "text-gray-400 !cursor-not-allowed" : ""}
                    ${year > maxYear ? "text-gray-400 !cursor-not-allowed" : ""}`}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>
        </PopoverContent>
      </div>
    </Popover>
  );
};
