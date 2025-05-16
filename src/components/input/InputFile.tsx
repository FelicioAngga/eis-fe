import { cn } from "@/lib/utils";
import { useRef, useState } from "react";
import { motion } from "motion/react";
import { GrUpload } from "react-icons/gr";
import { BiSolidFilePdf, BiSolidImageAlt } from "react-icons/bi";
import { IoDocumentText } from "react-icons/io5";
import Button from "../Button";
import { FiTrash } from "react-icons/fi";

type InputFileProps = React.InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
  label?: string;
  onChange?: (files: File[]) => void;
};

const mainVariant = {
  initial: {
    x: 0,
    y: 0,
  },
  animate: {
    x: 8,
    y: -8,
  },
};

const secondaryVariant = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
};

export const InputFile = ({
  error,
  label,
  onChange,
  ...props
}: InputFileProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startLoading = () => {
    setProgress(0);
    if (intervalRef.current) return; // avoid duplicate intervals

    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  const handleFileChange = (newFiles: File[]) => {
    if (newFiles.length === 0) return;
    setFiles(newFiles);
    setProgress(0);
    startLoading();
    if (newFiles[0]?.type.startsWith("image/")) {
      const objectUrl = URL.createObjectURL(newFiles[0]);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else setPreview(null);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <motion.div
        onClick={files.length > 0 ? () => {} : handleClick}
        whileHover="animate"
        className={`group/file block rounded-lg ${files.length <= 0 && "cursor-pointer"} w-full relative`}
      >
        <input
          {...props}
          ref={fileInputRef}
          id="file-upload-handle"
          type="file"
          multiple={false}
          onChange={(e) => handleFileChange(Array.from(e.target.files || []))}
          className="hidden"
        />
        {label && (
          <label className="mb-2 block text-xs font-medium">
            {label}{" "}
            {props.required && <span className="font-semibold text-danger">*</span>}
          </label>
        )}
        {files.length > 0 && (
          <div>
            <div className="flex gap-2">
              {progress !== 100 ? (
                <div className="border shrink-0 border-primary-600 p-1.5 rounded h-fit">
                  {files[0].type.startsWith("image/") ? 
                    <BiSolidImageAlt className="text-primary-600" size={20} /> : 
                    <IoDocumentText className="text-primary-600" size={20} />
                  }
                </div>
              ) : (
                <div className="size-8 shrink-0">
                  {files[0].type.startsWith("image/") ?
                    <img src={preview || ""} alt="preview" className="size-8 rounded object-cover" /> :
                    <BiSolidFilePdf size={32} />
                  }
                </div>
              )}
              <div className="w-full">
                <div className="flex gap-1 text-xs font-medium">
                  <p className="text-primary-700 max-w-[180px] truncate">{files[0].name}</p>
                  <p className="text-primary-400 max-w-[170px] truncate">• 20 January 2025 • {(files[0].size / 1024).toFixed(2)}kb</p>
                </div>
                {progress === 100 ? 
                  <p className="text-xs font-medium mt-0.5">Berhasil</p> : (
                  <div className="flex gap-2 items-center mt-0.5">
                    <div className="relative bg-primary-200 rounded h-1 w-full">
                      <div style={{ width: `${progress}%` }} className="transition-all absolute h-1 bg-primary rounded"></div>
                    </div>
                    <p className="text-primary-600 text-xs font-medium">{progress}%</p>
                  </div>
                )}
              </div>
              {progress === 100 && (
                <div className="flex gap-2 items-center shrink-0">
                  <Button onClick={handleClick} variant="outline" className="text-xs !px-3 py-2 h-[30px]">Ganti</Button>
                  <FiTrash className="cursor-pointer text-danger" size={16} />
                </div>
              )}
            </div>
          </div>
        )}

        {!files.length && (
          <div className="relative px-2 py-1.5 flex items-center justify-between border border-primary-200 rounded">
            <p className="text-xs font-medium text-primary-500">{props.placeholder}</p>
            <div className="relative">
              <motion.div
                layoutId={`file-upload ${label}`}
                variants={mainVariant}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
                className={cn(
                  "relative group-hover/file:shadow-2xl z-40 bg-primary dark:bg-neutral-900 flex items-center justify-center size-8 max-w-[8rem] mx-auto rounded",
                  "shadow-[0px_10px_50px_rgba(0,0,0,0.1)]"
                )}
              >
                <GrUpload className="h-4 w-4 text-white" />
              </motion.div>
              <motion.div
                variants={secondaryVariant}
                className="absolute opacity-0 border border-dashed border-primary-400 inset-0 z-30 bg-transparent flex items-center justify-center size-8 max-w-[8rem] mx-auto rounded"
              ></motion.div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
