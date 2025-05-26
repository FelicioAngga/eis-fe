import React, { useState, useRef, DragEvent, ChangeEvent } from "react";
import { GrClose } from "react-icons/gr";

const MainUploadIcon: React.FC = () => (
  <svg
    className="w-16 h-16 text-gray-400 group-hover:text-gray-500 transition-colors"
    stroke="currentColor"
    fill="none"
    viewBox="0 0 48 48"
    aria-hidden="true"
  >
    <path
      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

interface FileUploaderProps {
  selectedFile: File | null;
  setSelectedFile: React.Dispatch<React.SetStateAction<File | null>>;
  previewUrl: string | null;
  setPreviewUrl: React.Dispatch<React.SetStateAction<string | null>>;
}

export const FileUploader = ({ selectedFile, setSelectedFile, previewUrl, setPreviewUrl }: FileUploaderProps) => {

  const [error, setError] = useState<string | null>(null);

  const [isDragging, setIsDragging] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE_MB = 5;
  const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
  const ALLOWED_FILE_TYPES = ["image/jpeg", "image/jpg"];
  const ALLOWED_FILE_TYPES_STRING = "JPG & JPEG";

  const handleFile = (file: File | null) => {
    if (!file) {
      return;
    }

    if (!ALLOWED_FILE_TYPES.includes(file.type.toLowerCase())) {
      setError(
        `Format file tidak valid. Hanya ${ALLOWED_FILE_TYPES_STRING} yang diizinkan.`
      );
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setError(`Ukuran file maksimal ${MAX_FILE_SIZE_MB} MB.`);
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    setSelectedFile(file);
    setError(null);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    handleFile(file || null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    handleFile(file || null);
    if (event.dataTransfer.items) {
      event.dataTransfer.items.clear();
    } else {
      event.dataTransfer.clearData();
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col w-1/2 items-end">
      <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-xl shadow-lg">
        <h1 className="text-xl font-semibold text-gray-800 mb-1 text-left">
          Upload Foto
        </h1>
        <div
          className={`
            w-full
            border-2
            ${
              isDragging
                ? "border-blue-500 bg-blue-50"
                : error
                ? "border-red-400"
                : "border-gray-300 group-hover:border-gray-400"
            }
            ${previewUrl ? "border-solid p-2" : "border-dashed p-6"}
            rounded-lg
            text-center
            transition-all duration-200 ease-in-out
            relative
            group 
            ${!previewUrl ? "cursor-pointer" : ""}
          `}
          onClick={!previewUrl ? triggerFileInput : undefined}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") triggerFileInput();
          }}
          aria-label="Area unggah gambar"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleChange}
            accept={ALLOWED_FILE_TYPES.join(",")}
            className="hidden"
            aria-labelledby="upload-label"
          />

          {previewUrl ? (
            <div className="relative group/preview">
              <img
                src={previewUrl}
                alt="Pratinjau Gambar"
                className="w-full h-60 object-cover rounded-md"
              />
              <div className="absolute inset-0 group-hover/preview:bg-black/20 transition-opacity duration-200 rounded-md flex items-center justify-center">
                <button
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1.5 hover:bg-opacity-75 transition-all focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-75 opacity-0 group-hover/preview:opacity-100"
                  aria-label="Hapus gambar"
                >
                  <GrClose className="w-4 h-4 cursor-pointer" />
                </button>
                <button
                  onClick={triggerFileInput}
                  className="bg-white text-gray-800 py-2 px-4 rounded-md shadow-md hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 opacity-0 group-hover/preview:opacity-100 text-sm font-medium cursor-pointer"
                  aria-label="Ganti gambar"
                >
                  Ganti Gambar
                </button>
              </div>
            </div>
          ) : (
            <div
              className="flex flex-col items-center justify-center py-6 sm:py-8"
              id="upload-label"
            >
              <div className="relative mb-2">
                <MainUploadIcon />
              </div>
              <p className="text-base sm:text-lg font-medium text-gray-700 group-hover:text-gray-800 transition-colors">
                Unggah Gambar
              </p>
            </div>
          )}
        </div>

        {!previewUrl && (
          <p className="mt-3 text-xs sm:text-sm text-gray-500 text-center">
            max. {MAX_FILE_SIZE_MB} MB, format {ALLOWED_FILE_TYPES_STRING}
          </p>
        )}

        {error && (
          <p className="mt-2 text-sm text-red-600 text-center" role="alert">
            {error}
          </p>
        )}
        {selectedFile && !error && previewUrl && (
          <p className="mt-2 text-sm text-green-600 text-center">
            File "{selectedFile.name}" siap diunggah.
          </p>
        )}
      </div>
    </div>
  );
};
