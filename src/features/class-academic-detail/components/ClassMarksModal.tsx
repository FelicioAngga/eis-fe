import { Modal } from "antd"
import Form from "../../../components/Form";
import { useForm } from "react-hook-form";
import useYupValidationResolver from "../../../hooks/useYupValidationResolver";
import * as Yup from "yup";
import { Input } from "../../../components/input/Input";
import Button from "../../../components/Button";
import { StudentGradesEntryModel } from "../../../api-hooks/student-grades/models/StudentGradesModel";
import { useEffect } from "react";

type StudentGradesPopUpModel = {
  student_name: string;
  student_nis: string;
  subject_name: string;
  subject_id: number;
}
export type ClassMarksModalEditData = StudentGradesPopUpModel & StudentGradesEntryModel;

interface ClassMarksModalProps {
  isOpen: boolean;
  onClose: () => void;
  editData: ClassMarksModalEditData | null;
  handleSaveModal?: (data: StudentGradesEntryModel, subject_id: number) => void;
}

function ClassMarksModal({ isOpen, onClose, editData, handleSaveModal }: ClassMarksModalProps) {
  const yupSchema = Yup.object().shape({
    first_quiz: Yup.string(),
    first_month: Yup.string(),
    second_quiz: Yup.string(),
    second_month: Yup.string(),
    finals: Yup.string(),
    remarks: Yup.string().optional(),
  });

  const resolver = useYupValidationResolver(yupSchema)
  const methods = useForm({
    mode: "onChange",
    resolver,
    defaultValues: {
      first_quiz: editData?.first_quiz || "",
      first_month: editData?.first_month || "",
      second_quiz: editData?.second_quiz || "",
      second_month: editData?.second_month || "",
      finals: editData?.finals || "",
      remarks: editData?.remarks || "",
    },
  });

  const handleSubmit = (data: StudentGradesEntryModel) => {
    if (!handleSaveModal) return;
    handleSaveModal({
      student_id: editData?.student_id,
      first_quiz: data.first_quiz ? parseFloat(data.first_quiz.toString()) : undefined,
      first_month: data.first_month ? parseFloat(data.first_month.toString()) : undefined,
      second_quiz: data.second_quiz ? parseFloat(data.second_quiz.toString()) : undefined,
      second_month: data.second_month ? parseFloat(data.second_month.toString()) : undefined,
      finals: data.finals ? parseFloat(data.finals.toString()) : undefined,
      remarks: data.remarks,
    }, editData?.subject_id || 0);
    handleClose();
  }

  const handleClose = () => {
    methods.reset();
    onClose();
  }

  useEffect(() => {
    if (!editData) return;
    methods.reset({
      first_quiz: editData?.first_quiz || "",
      first_month: editData?.first_month || "",
      second_quiz: editData?.second_quiz || "",
      second_month: editData?.second_month || "",
      finals: editData?.finals || "",
      remarks: editData?.remarks || "",
    })
  }, [editData])

  return (
    <Modal
      open={isOpen}
      footer={null}
      onCancel={handleClose}
      maskClosable={false}
      centered
      title="Data Nilai"
    >
      <Form methods={methods} onSubmit={handleSubmit}>
        <table className="font-medium">
          <tbody>
            <tr>
              <td className="pr-4 pb-3">Nama Lengkap</td>
              <td className="pr-4 pb-3">:</td>
              <td className="pr-4 pb-3">{editData?.student_name}</td>
            </tr>
            <tr>
              <td className="pr-4 pb-3">NIS</td>
              <td className="pr-4 pb-3">:</td>
              <td className="pr-4 pb-3">{editData?.student_nis || "-"}</td>
            </tr>
            <tr>
              <td className="pr-4 pb-3">Mata Pelajaran</td>
              <td className="pr-4 pb-3">:</td>
              <td className="pr-4 pb-3">{editData?.subject_name}</td>
            </tr>
          </tbody>
        </table>

        <div className="mt-2 flex flex-col gap-3">
          <Input
            type="number"
            name="first_quiz"
            label="Nilai Tugas Bulanan 1"
            placeholder="Masukkan nilai tugas bulanan 1"
          />
          <Input
            type="number"
            name="first_month"
            label="Ujian Bulanan 1"
            placeholder="Masukkan nilai ujian bulanan 1"
          />
          <Input
            type="number"
            name="second_quiz"
            label="Nilai Tugas Bulanan 2"
            placeholder="Masukkan nilai tugas bulanan 2"
          />
          <Input
            type="number"
            name="second_month"
            label="Ujian Bulanan 2"
            placeholder="Masukkan nilai ujian bulanan 2"
          />
          <Input
            type="number"
            name="finals"
            label="Ujian Akhir"
            placeholder="Masukkan nilai Ujian Akhir"
          />
          <Input
            type="text"
            name="remarks"
            label="Deskripsi"
            placeholder="Masukkan deskripsi"
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

export default ClassMarksModal