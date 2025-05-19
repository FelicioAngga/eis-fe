import { FiArrowRight } from "react-icons/fi";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string;
  variant?: "primary" | "primaryDark" | "secondary" | "outline" | "outlineHovered" | "success";
  showArrow?: boolean;
  disabledUI?: boolean;
};

function Button({
  children,
  className,
  variant = "primary",
  showArrow = false,
  disabledUI = false,
  ...rest
}: ButtonProps) {
  const variantStyles = {
    primary:
      `bg-blue text-white hover:bg-white border border-transparent ${rest.disabled || disabledUI || 'hover:border-blue hover:text-black'} rounded-md`,
    primaryDark: "bg-white text-primary hover:bg-primary border border-transparent hover:border-white hover:text-white rounded-md",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 rounded-md",
    outline:
      "border border-[#222] border text-gray-800 hover:bg-gray-100 rounded-md",
    outlineHovered:
      "border border-transparent hover:border-primary-400 rounded-md ",
    success: `bg-success text-white border border-transparent hover:border-success hover:text-success hover:bg-white disabled:hover:border-transparent rounded-sm`,
  };

  return (
    <button
      {...rest}
      disabled={rest.disabled || disabledUI}
      className={`transition-all duration-[400ms] flex justify-center items-center gap-3 ${showArrow && 'min-w-[120px] 2xl:min-w-32'} px-5 py-2.5 h-10 cursor-pointer group
        font-semibold text-sm 2xl:text-base disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-primary-300 ${variantStyles[variant]} ${className}
        ${(disabledUI || rest.disabled) && '!bg-gray-100 !text-primary-300 hover:border-transparent'}
      `}
    >
      {children}
      {showArrow && 
      <div className={`transition-all duration-[400ms] flex justify-center items-center rounded-full size-1 bg-white
      ${(variant == 'primaryDark' && !rest.disabled && !disabledUI) && '!bg-primary group-hover:!bg-white'} 
      ${rest.disabled || disabledUI ? '!bg-primary-300' : 'group-hover:size-5 group-hover:bg-primary'}`}>
        <FiArrowRight className={`transition-all duration-[400ms] size-0 ${rest.disabled || disabledUI || 'group-hover:size-3 group-hover:text-white'} text-primary
        ${variant == 'primaryDark' && 'text-white group-hover:!text-primary'}`} />
      </div>}
    </button>
  );
}

export default Button;
