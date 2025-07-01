import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

type InputPasswordProps = React.InputHTMLAttributes<HTMLInputElement> & {
  showEyeIcon?: boolean,
  error?: string,
  label?: string,
}

export function InputPassword({ showEyeIcon = true, error, label, ...props }: InputPasswordProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full">
      {label && (
        <label className="mb-1.5 block text-sm font-medium">
          {label}{" "}
          {props.required && (
            <span className="font-semibold text-danger">*</span>
          )}
        </label>
      )}

      <div className="relative">
        <input
          {...props}
          type={showPassword ? "text" : "password"}
          className={`font-medium border ${error ? "border-danger" : "border-primary-200"} px-4 py-3 w-full text-sm rounded ${props.className}`}
        />

        { showEyeIcon && 
          <button
            type="button"
            onClick={() => setShowPassword(prev => !prev)}
            className="absolute top-1/2 right-4 -translate-y-1/2 text-gray hover: text-gray-800 cursor-pointer focus:outline-none"
          >
            {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
          </button>
        }
      </div>

      {error && <p className="text-danger text-xs font-medium mt-0.5">{error}</p>}
    </div>
  );
}