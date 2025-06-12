import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useController, useFormContext } from "react-hook-form";
import { cn } from "../../utils/utils";

type InputTextProps = React.InputHTMLAttributes<HTMLInputElement> & {
  placeholders?: string[];
  formatNumberSeparator?: boolean;
  error?: string;
  label?: string;
};
 
export function InputText({ error, label, formatNumberSeparator, placeholders = [], ...props }: InputTextProps) {
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
  const { control } = useFormContext();
    const { field } = useController({ control, name: props.name || "" });
 
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startAnimation = () => {
    intervalRef.current = setInterval(() => {
      setCurrentPlaceholder((prev) => (prev + 1) % placeholders.length);
    }, 3000);
  };
  const handleVisibilityChange = () => {
    if (document.visibilityState !== "visible" && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    } else if (document.visibilityState === "visible") {
      startAnimation();
    }
  };
 
  useEffect(() => {
    startAnimation();
    document.addEventListener("visibilitychange", handleVisibilityChange);
 
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [placeholders]);
 
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const newDataRef = useRef<any[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
 
  const draw = useCallback(() => {
    if (!inputRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
 
    canvas.width = 800;
    canvas.height = 800;
    ctx.clearRect(0, 0, 800, 800);
    const computedStyles = getComputedStyle(inputRef.current);
 
    const fontSize = parseFloat(computedStyles.getPropertyValue("font-size"));
    ctx.font = `${fontSize * 2}px ${computedStyles.fontFamily}`;
    ctx.fillStyle = "#FFF";
    ctx.fillText((props.value || "").toString(), 16, 40);
 
    const imageData = ctx.getImageData(0, 0, 800, 800);
    const pixelData = imageData.data;
    const newData: any[] = [];
 
    for (let t = 0; t < 800; t++) {
      let i = 4 * t * 800;
      for (let n = 0; n < 800; n++) {
        let e = i + 4 * n;
        if (
          pixelData[e] !== 0 &&
          pixelData[e + 1] !== 0 &&
          pixelData[e + 2] !== 0
        ) {
          newData.push({
            x: n,
            y: t,
            color: [
              pixelData[e],
              pixelData[e + 1],
              pixelData[e + 2],
              pixelData[e + 3],
            ],
          });
        }
      }
    }
 
    newDataRef.current = newData.map(({ x, y, color }) => ({
      x,
      y,
      r: 1,
      color: `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]})`,
    }));
  }, [props?.value]);
 
  useEffect(() => {
    draw();
  }, [props?.value, draw]);

  const formatNumber = (val: any) => {
    const num = val?.toString().replace(/,/g, "");
    if (isNaN(num) || num === "") return "";
    return formatNumberSeparator ? Number(num).toLocaleString("en-US") : num;
  };
 
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
      <div
        className={cn(
          "w-full relative bg-white px-3 py-3 text-sm rounded overflow-hidden transition duration-200 border",
          error ? "border-danger" : "border-primary-200",
          props.disabled ? "bg-gray-200 cursor-not-allowed" : "cursor-text",
        )}
      >
        <canvas
          className={cn(
            "absolute pointer-events-none  text-base transform scale-50 top-[20%] left-2 sm:left-8 origin-top-left filter invert pr-20 opacity-0",
          )}
          ref={canvasRef}
        />
        <input
          {...props}
          type="text"
          onKeyDown={(e) => {
            if (['e', 'E', '+', '-'].includes(e.key) && props.type === "number") e.preventDefault()
          }}
          value={
            props.type === "number" ? formatNumber(field.value) : field.value
          }
          onChange={(e) => {
            let value = e.target.value;
            if (props.type === "number") {
              value = value.replace(/,/g, "");
              if (!/^\d*$/.test(value)) return;
            }
            field.onChange(value);
          }}
          ref={inputRef}
          placeholder=""
          className={cn(
            "w-full text-sm relative z-50 border-none bg-transparent text-black h-full font-medium pl-1",
            props.className
          )}
        />
  
        <div className="absolute inset-0 flex items-center rounded-full pointer-events-none">
          <AnimatePresence mode="wait">
            {!props.value && (
              <motion.p
                initial={{
                  y: 5,
                  opacity: 0,
                }}
                key={`current-placeholder-${currentPlaceholder}`}
                animate={{
                  y: 0,
                  opacity: 1,
                }}
                exit={{
                  y: -15,
                  opacity: 0,
                }}
                transition={{
                  duration: 0.3,
                  ease: "linear",
                }}
                className="text-sm font-medium text-primary-500 pl-4 text-left w-[calc(100%-2rem)] truncate"
              >
                {placeholders[currentPlaceholder]}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
      {error && <p className="text-danger text-xs font-medium mt-0.5">{error}</p>}
    </div>
  );
}