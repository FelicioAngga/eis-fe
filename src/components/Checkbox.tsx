import React, { forwardRef } from "react";

type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, ...props }, ref) => {
    const checkboxId = `checkbox-${
      props.name || Math.random().toString(36).substr(2, 9)
    }`;

    return (
      <label className="flex items-center space-x-3 cursor-pointer select-none">
        <input
          id={checkboxId}
          type="checkbox"
          ref={ref}
          className="peer hidden"
          {...props}
        />
        <div className="w-5 h-5 mr-2 rounded border group-hover:border-primary border-gray-300 
        peer-checked:border-transparent peer-checked:text-white text-transparent peer-checked:bg-primary transition-all duration-200 ease-in-out flex items-center justify-center">
          <svg
            className="w-4 h-4 pointer-events-none"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        {label && (
          <span className="text-sm font-medium text-gray-800">{label}</span>
        )}
      </label>
    );
  }
);

export default Checkbox;
