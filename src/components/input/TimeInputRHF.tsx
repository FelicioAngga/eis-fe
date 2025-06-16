import { useId, useRef, useState } from "react";
import { FieldValues, useController, useFormContext } from "react-hook-form";

type TimeInputRHFProps = React.InputHTMLAttributes<HTMLInputElement> & {
  name?: string;
  label?: string;
};

export function TimeInputRHF({ 
  label,
  name = '',
  required,
  className,
  value: externalValue,
  onChange: externalOnChange,
  ...props
}: TimeInputRHFProps) {
  const inputId = useId();
  const timeInputRef = useRef<HTMLInputElement>(null);
  let rhfControl: ReturnType<typeof useController> | null = null;
  let rhfContext: ReturnType<typeof useFormContext<FieldValues>> | null = null;

  try {
    rhfContext = useFormContext();
    rhfControl = useController({ name, control: rhfContext.control });
  } catch {
    rhfContext = null;
    rhfControl = null;
  }

  const [localValue, setLocalValue] = useState(externalValue ?? "");
  const value = rhfControl?.field.value ?? externalValue ?? localValue;
  const onChange = rhfControl?.field.onChange ?? externalOnChange ?? setLocalValue;
  const error = rhfControl?.fieldState?.error;

  const handleVisualAreaClick = () => {
    if (timeInputRef.current) {
      if (typeof timeInputRef.current.showPicker === 'function') {
        try {
          timeInputRef.current.showPicker();
        } catch (e) {
          console.warn("showPicker() failed, falling back to click()", e);
          timeInputRef.current.click();
        }
      } else {
        timeInputRef.current.click();
      }
    }
  };
  
  return (
    <label htmlFor={inputId} className="relative w-full block">
      <div 
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm bg-white text-gray-900 flex justify-between items-center cursor-pointer"
        onClick={handleVisualAreaClick}
      >
        <span>{value || 'hh:mm:ss'}</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}> 
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <input
        {...props}
        ref={timeInputRef}
        id={inputId}
        type="time"
        step={1}
        value={value}
        onChange={(e) => onChange(e.currentTarget.value)}
        className="absolute top-0 left-0 w-full h-full opacity-0 pointer-events-none"
        tabIndex={-1}
      />
      {error?.message && <p className="text-danger text-xs font-medium mt-0.5">{error.message}</p>}
    </label>
  );
};