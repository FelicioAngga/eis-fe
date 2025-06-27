import { useId, useRef } from "react";
interface CustomTimeInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const CustomTimeInput: React.FC<CustomTimeInputProps> = ({ value, onChange }) => {
  const inputId = useId();
  const timeInputRef = useRef<HTMLInputElement>(null);

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
        <span>{value || 'hh:mm'}</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}> 
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <input
        ref={timeInputRef}
        id={inputId}
        type="time"
        value={value}
        onChange={onChange}
        min="06:00"
        max="18:00"
        className="absolute top-0 left-0 w-full h-full opacity-0 pointer-events-none"
        tabIndex={-1}
      />
    </label>
  );
};
