import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFormContext, useController, FieldValues } from "react-hook-form";

type Option = {
  label: string;
  value: string;
};

interface RadioGroupProps {
  name: string;
  options: Option[];
  direction?: "row" | "column";
  size?: "sm" | "md";
  value?: string;
  onChange?: (value: string) => void;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  options,
  direction = "column",
  size,
  value: externalValue,
  onChange: externalOnChange,
}) => {
  let rhfControl: ReturnType<typeof useController> | null = null;
  let rhfContext: ReturnType<typeof useFormContext<FieldValues>> | null = null;

  try {
    rhfContext = useFormContext();
    rhfControl = useController({ name, control: rhfContext.control });
  } catch {
    rhfContext = null;
    rhfControl = null;
  }

  const [localValue, setLocalValue] = React.useState(externalValue ?? "");

  const value = rhfControl?.field.value ?? externalValue ?? localValue;
  const onChange = rhfControl?.field.onChange ?? externalOnChange ?? setLocalValue;

  const error = rhfControl?.fieldState?.error;

  return (
    <>
      <div className={`flex ${direction === "column" ? "flex-col" : "flex-row"} gap-3`}>
        {options.map((option) => {
          const isSelected = value === option.value;

          return (
            <label
              key={option.value}
              className="flex items-center gap-2 cursor-pointer select-none group"
            >
              <div
                className={`${size === "sm" ? "size-4" : "size-5"} rounded-full border-2 flex items-center justify-center transition-colors duration-[650ms]
                  ${
                    isSelected
                      ? "bg-black border-black"
                      : "bg-white border-gray-400"
                  }
                  group-hover:ring-1 group-hover:ring-black/20`}
              >
                <AnimatePresence>
                  {isSelected && (
                    <motion.svg
                      key="checkmark"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className={`${size === "sm" ? "size-3" : "size-4"}"`}
                    >
                      <motion.path
                        fill="none"
                        stroke="#fff"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 12l4 4 8-8"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        exit={{ pathLength: 0 }}
                        transition={{ duration: 0.45, ease: "easeOut" }}
                      />
                    </motion.svg>
                  )}
                </AnimatePresence>
              </div>

              <input
                type="radio"
                name={name}
                value={option.value}
                checked={isSelected}
                onChange={() => onChange(option.value)}
                className="hidden"
              />

              <span className={`font-medium ${size === 'sm' && 'text-sm'} text-gray-800`}>{option.label}</span>
            </label>
          );
        })}
      </div>
      {error?.message && <p className="text-danger text-xs font-medium mt-0.5">{error.message}</p>}
    </>
  );
};
