import { Modal } from "antd";
import { useRef, useState } from "react";
import Button from "../../../components/Button";
import { handleImportTeacherAbsence } from "../helpers/teacher-absence-excel";
import { TeacherAbsenceCreateModel } from "../../../api-hooks/teacher-absence/models/TeacherAbsenceModel";
import { useCreateTeacherAbsenceBatch } from "../../../api-hooks/teacher-absence/api";
import { useAlert } from "../../../contexts/AlertContext";
import { useQueryClient } from "@tanstack/react-query";

interface TeacherAbsenceImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function TeacherAbsenceImportModal({
  isOpen,
  onClose,
}: TeacherAbsenceImportModalProps) {
  const { showAlert } = useAlert();
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [formattedAbsenceList, setFormattedAbsenceList] = useState<TeacherAbsenceCreateModel[]>([]);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const absenceList = await handleImportTeacherAbsence(selectedFile);
      setFormattedAbsenceList(absenceList);
    }
    else setFile(null);
  }

  const { mutateAsync, isPending } = useCreateTeacherAbsenceBatch();
  async function handleSubmit() {
    if (formattedAbsenceList.length === 0) {
      showAlert({
        title: "Gagal Import",
        type: "error",
        message: "Tidak ada data absensi yang ditemukan di file yang dipilih.",
      });
      return;
    }
    const response = await mutateAsync(formattedAbsenceList);
    if (response.status === 200) {
      showAlert({
        title: "Berhasil Import",
        type: "success",
        message: "Data absensi guru berhasil diimpor.",
      });
      queryClient.invalidateQueries({ queryKey: ["teacher-absences"] });
      handleClose();
    } else {
      showAlert({
        title: "Gagal Import",
        type: "error",
        message: response.message || "Terjadi kesalahan saat mengimpor data.",
      });
    }
  }

  function handleClose() {
    setFile(null);
    inputFileRef.current!.value = "";
    onClose();
  }

  return (
    <Modal
      open={isOpen}
      footer={null}
      onCancel={handleClose}
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
        <Button onClick={handleClose} className="w-full" variant="outline">Batal</Button>
        <Button disabled={isPending} onClick={handleSubmit} className="w-full">Simpan</Button>
      </div>
    </Modal>
  );
}

export default TeacherAbsenceImportModal;
