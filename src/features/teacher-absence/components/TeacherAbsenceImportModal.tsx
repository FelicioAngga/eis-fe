import { Modal } from "antd";
import { useRef, useState } from "react";
import Button from "../../../components/Button";

interface TeacherAbsenceImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function TeacherAbsenceImportModal({
  isOpen,
  onClose,
}: TeacherAbsenceImportModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const inputFileRef = useRef<HTMLInputElement>(null);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) setFile(selectedFile);
    else setFile(null);
  }

  return (
    <Modal
      open={isOpen}
      footer={null}
      onCancel={onClose}
      maskClosable={false}
      centered
      title={`Import Excel Absensi Guru`}
    >
      <input
        multiple={false}
        type="file"
        accept=".xlsx, .xls"
        hidden
        ref={inputFileRef}
        onChange={handleFileChange}
      />
      <div className="border border-gray-400 rounded">
        <div className="p-2 flex items-center gap-4 justify-between">
          <div className="text-gray-500 font-medium w-1/2">
            {file ? (
              <p className="text-xs text-primary-700">{file?.name}</p>
            ) : (
              <p className="text-gray-500">Pilih file excel dari mesin</p>
            )}
          </div>
          <Button
            onClick={() => inputFileRef.current?.click()}
            className="w-1/3"
          >
            Pilih File Excel
          </Button>
        </div>
      </div>

      <div className="flex gap-5 mt-8">
        <Button className="w-full" variant="outline">Batal</Button>
        <Button className="w-full">Simpan</Button>
      </div>
    </Modal>
  );
}

export default TeacherAbsenceImportModal;
