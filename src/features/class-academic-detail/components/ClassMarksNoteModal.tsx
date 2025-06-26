import { Modal } from "antd"
import Form from "../../../components/Form";
import { useForm } from "react-hook-form";
import useYupValidationResolver from "../../../hooks/useYupValidationResolver";
import * as Yup from "yup";
import { Input } from "../../../components/input/Input";
import Button from "../../../components/Button";
import { useEffect } from "react";
import { UpdateAcademicStudentNoteModel } from "../../../api-hooks/class/models/ClassModel";

interface ClassMarksNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  isFirstTerm?: boolean;
  editData: UpdateAcademicStudentNoteModel | null;
  handleSaveNoteModal?: (data: UpdateAcademicStudentNoteModel) => void;
}

function ClassMarksNoteModal({ isOpen, onClose, isFirstTerm, editData, handleSaveNoteModal }: ClassMarksNoteModalProps) {
  const yupSchema = Yup.object().shape({
    notes: Yup.string().required("Catatan Wali Kelas tidak boleh kosong"),
  });

  const resolver = useYupValidationResolver(yupSchema)
  const methods = useForm({
    mode: "onChange",
    resolver,
    defaultValues: {
      notes: (isFirstTerm ? editData?.first_term_notes : editData?.second_term_notes) || "",
    },
  });

  const handleSubmit = (data: { notes: string }) => {
    if (!handleSaveNoteModal) return;
    handleSaveNoteModal({
      id: editData?.id || 0,
      academic_id: editData?.academic_id || 0,
      student_id: editData?.student_id || 0,
      first_term_notes: isFirstTerm ? data.notes : editData?.first_term_notes || "",
      second_term_notes: isFirstTerm ? editData?.second_term_notes || "" : data.notes,
    });
    handleClose();
  }

  const handleClose = () => {
    methods.reset();
    onClose();
  }

  useEffect(() => {
    if (!editData) return;
    methods.reset({
      notes: isFirstTerm ? editData.first_term_notes : editData.second_term_notes || "",
    })
  }, [editData])

  return (
    <Modal
      open={isOpen}
      footer={null}
      onCancel={handleClose}
      maskClosable={false}
      centered
      title="Catatan Wali Kelas"
    >
      <Form methods={methods} onSubmit={handleSubmit}>
        <table className="font-medium">
          <tbody>
            <tr>
              <td className="pr-4 pb-3">Nama Lengkap Siswa</td>
              <td className="pr-4 pb-3">:</td>
              <td className="pr-4 pb-3">{editData?.student_name}</td>
            </tr>
          </tbody>
        </table>

        <div className="mt-2 flex flex-col gap-3">
          <Input
            type="textarea"
            rows={4}
            name="notes"
            label="Catatan Wali Kelas"
            placeholder="Masukkan Catatan Wali Kelas"
          />
        </div>
        <div className="flex gap-5 mt-5">
          <Button onClick={handleClose} className="w-full" type="button" variant="outline">Batal</Button>
          <Button className="w-full">Simpan</Button>
        </div>
      </Form>
    </Modal>
  )
}

export default ClassMarksNoteModal