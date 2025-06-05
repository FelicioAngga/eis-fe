import { useRef, useState } from "react";
import defaultUser from "../../../assets/images/default-user.jpeg";
import { FiEdit } from "react-icons/fi";

function StudentViewData() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const inputFileRef = useRef<any>(null);
  
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setFile(file);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }

  return (
    <div className="flex gap-5">
      <div className="border border-gray-300 p-2">
        <div className="relative size-20 mx-auto">
          <img src={preview || defaultUser} className="rounded-full object-cover size-20" />
          <input
            onChange={handleFileChange}
            ref={inputFileRef}
            type="file"
            className="hidden"
            multiple={false}
            accept='image/*'
          />
          <div onClick={() => inputFileRef.current.click()} className="rounded-full absolute right-0 bottom-0 bg-blue p-1 cursor-pointer">
            <FiEdit className="size-4 text-white" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentViewData