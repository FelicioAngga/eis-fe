import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import useYupValidationResolver from "../../../hooks/useYupValidationResolver";
import * as Yup from "yup";
import { Input } from "../../../components/input/Input";
import Button from "../../../components/Button";
import { Modal } from "antd";
import Form from "../../../components/Form";
import { StudentBehaviourModel } from "../../../api-hooks/student-behaviour/models/StudentBehaviourModel";
import { useSubjectsQuery } from "../../../api-hooks/subjects/api";

type StudentBehaviourPopUpModel = {
  student_name: string;
  student_nis: string;
};
export type StudentBehaviourModalEditData = StudentBehaviourPopUpModel &
  StudentBehaviourModel;

interface StudentBehaviourModalProps {
  isOpen: boolean;
  month: "Bulanan 1" | "Bulanan 2";
  onClose: () => void;
  editData: StudentBehaviourModalEditData | null;
  handleSaveModal?: (data: StudentBehaviourModel) => void;
}

function StudentBehaviourModal({
  month,
  editData,
  isOpen,
  onClose,
  handleSaveModal,
}: StudentBehaviourModalProps) {
  const { data: subjectData } = useSubjectsQuery({
    pagination: {
      limit: 9999,
      page: 1,
      sortColumn: "name",
      sortOrder: "asc",
    },
    search: "",
  });
  const extracurricularList = useMemo(() => {
    if (!subjectData?.data) return [];
    return subjectData.data
      .filter((subject) => subject.is_extracurricular)
      .map((subject) => ({
        label: subject.name,
        value: subject.name,
      }));
  }, [subjectData?.data]);

  const yupSchema = Yup.object().shape({
    craft: Yup.string(),
    neatness: Yup.string(),
    behaviour: Yup.string(),
    extracurricular_first: Yup.string(),
    extracurricular_score_first: Yup.string(),
    extracurricular_second: Yup.string(),
    extracurricular_score_second: Yup.string(),
    notes: Yup.string(),
  });

  const resolver = useYupValidationResolver(yupSchema);
  const methods = useForm({
    mode: "onChange",
    resolver,
    defaultValues: {
      craft: month === "Bulanan 1" ? editData?.first_crafts || "" : editData?.second_crafts || "",
      neatness:  month === "Bulanan 1" ? editData?.first_neatness || "" : editData?.second_neatness || "",
      behaviour:  month === "Bulanan 1" ? editData?.first_behaviour || "" : editData?.second_behaviour || "",
      notes: month === "Bulanan 1" ? editData?.first_notes || "" : editData?.second_notes || "",
      extracurricular_first:  month === "Bulanan 1" ? editData?.first_month_extracurricular_first || "" : editData?.second_month_extracurricular_first || "",
      extracurricular_score_first: month === "Bulanan 1" ? editData?.first_month_extracurricular_score_first || "" : editData?.second_month_extracurricular_score_first || "",
      extracurricular_second:  month === "Bulanan 1" ? editData?.first_month_extracurricular_second || "" : editData?.second_month_extracurricular_second || "",
      extracurricular_score_second:  month === "Bulanan 1" ? editData?.first_month_extracurricular_score_second || "" : editData?.second_month_extracurricular_score_second || "",
    },
  });

  const handleSubmit = (data: {
    craft: string;
    neatness: string;
    behaviour: string;
    extracurricular_first: string;
    extracurricular_score_first: string;
    extracurricular_second: string;
    extracurricular_score_second: string;
    notes?: string;
  }) => {
    if (!handleSaveModal) return;
    if (month === "Bulanan 1") {
      handleSaveModal({
        id: editData?.id,
        academic_id: editData?.academic_id || 0,
        term_id: editData?.term_id || 0,
        student_id: editData?.student_id || 0,
        student_name: editData?.student_name || "",
        student_nis: editData?.student_nis || "",
        first_crafts: data.craft,
        first_notes: data.notes || "",
        first_neatness: data.neatness,
        first_behaviour: data.behaviour,
        first_month_extracurricular_first: data.extracurricular_first,
        first_month_extracurricular_score_first: data.extracurricular_score_first,
        first_month_extracurricular_second: data.extracurricular_second,
        first_month_extracurricular_score_second: data.extracurricular_score_second,
      });
    } else {
      handleSaveModal({
        id: editData?.id || undefined,
        academic_id: editData?.academic_id || 0,
        term_id: editData?.term_id || 0,
        student_id: editData?.student_id || 0,
        student_name: editData?.student_name || "",
        student_nis: editData?.student_nis || "",
        second_crafts: data.craft,
        second_notes: data.notes || "",
        second_neatness: data.neatness,
        second_behaviour: data.behaviour,
        second_month_extracurricular_first: data.extracurricular_first,
        second_month_extracurricular_score_first: data.extracurricular_score_first,
        second_month_extracurricular_second: data.extracurricular_second,
        second_month_extracurricular_score_second: data.extracurricular_score_second,
      });
    }

    handleClose();
  };

  const handleClose = () => {
    methods.reset();
    onClose();
  };

  useEffect(() => {
    if (!editData) return;
    const timeoutId = setTimeout(() => {
      methods.reset({
        craft: (month === "Bulanan 1" ? editData?.first_crafts : editData?.second_crafts) || "",
        neatness: (month === "Bulanan 1" ? editData?.first_neatness : editData?.second_neatness) || "",
        behaviour: (month === "Bulanan 1" ? editData?.first_behaviour : editData?.second_behaviour) || "",
        notes: (month === "Bulanan 1" ? editData?.first_notes : editData?.second_notes) || "",
        extracurricular_first: month === "Bulanan 1" ? editData?.first_month_extracurricular_first || "" : editData?.second_month_extracurricular_first || "",
        extracurricular_score_first: month === "Bulanan 1" ? editData?.first_month_extracurricular_score_first || "" : editData?.second_month_extracurricular_score_first || "",
        extracurricular_second: month === "Bulanan 1" ? editData?.first_month_extracurricular_second || "" : editData?.second_month_extracurricular_second || "",
        extracurricular_score_second: month === "Bulanan 1" ? editData?.first_month_extracurricular_score_second || "" : editData?.second_month_extracurricular_score_second || "",
      });
    })
    return () => clearTimeout(timeoutId);
  }, [editData, month, methods]);

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
              <td className="pb-3 pr-4">Nama Lengkap</td>
              <td className="pb-3 pr-4">:</td>
              <td className="pb-3 pr-4">{editData?.student_name}</td>
            </tr>
            <tr>
              <td className="pb-3 pr-4">NIS</td>
              <td className="pb-3 pr-4">:</td>
              <td className="pb-3 pr-4">{editData?.student_nis || "-"}</td>
            </tr>
            <tr>
              <td className="pb-3 pr-4">Bulanan Ke</td>
              <td className="pb-3 pr-4">:</td>
              <td className="pb-3 pr-4">{month}</td>
            </tr>
          </tbody>
        </table>

        <div className="flex flex-col gap-3 mt-2">
          <Input
            type="select"
            name="behaviour"
            label="Nilai Kelakuan"
            placeholder="Masukkan Nilai Kelakuan"
            options={[
              { label: "A", value: "A" },
              { label: "B", value: "B" },
              { label: "C", value: "C" },
              { label: "D", value: "D" },
            ]}
          />
          <Input
            type="select"
            name="neatness"
            label="Nilai Kerapian"
            placeholder="Masukkan Nilai Kerapian"
            options={[
              { label: "A", value: "A" },
              { label: "B", value: "B" },
              { label: "C", value: "C" },
              { label: "D", value: "D" },
            ]}
          />
          <Input
            type="select"
            name="craft"
            label="Nilai Kerajinan"
            placeholder="Masukkan Nilai Kerajinan"
            options={[
              { label: "A", value: "A" },
              { label: "B", value: "B" },
              { label: "C", value: "C" },
              { label: "D", value: "D" },
            ]}
          />
          <Input
            type="text"
            name="notes"
            label="Nama Catatan"
            placeholder="Masukkan Catatan"
          />
          <Input
            type="select"
            name="extracurricular_first"
            label="Nama Ekstrakurikuler 1"
            placeholder="Pilih Nama Ekstrakurikuler 1"
            options={extracurricularList.filter(item => item.value !== methods.watch("extracurricular_second"))}
          />
          <Input
            type="select"
            name="extracurricular_score_first"
            label="Nilai Ekstrakurikuler 1"
            placeholder="Masukkan Nilai Ekstrakurikuler 1"
            options={[
              { label: "A", value: "A" },
              { label: "B", value: "B" },
              { label: "C", value: "C" },
              { label: "D", value: "D" },
            ]}
          />
          <Input
            type="select"
            name="extracurricular_second"
            label="Nama Ekstrakurikuler 2"
            placeholder="Pilih Nama Ekstrakurikuler 2"
            options={extracurricularList.filter(item => item.value !== methods.watch("extracurricular_first"))}
          />
          <Input
            type="select"
            name="extracurricular_score_second"
            label="Nilai Ekstrakurikuler 2"
            placeholder="Masukkan Nilai Ekstrakurikuler 2"
            options={[
              { label: "A", value: "A" },
              { label: "B", value: "B" },
              { label: "C", value: "C" },
              { label: "D", value: "D" },
            ]}
          />
        </div>
        <div className="flex gap-5 mt-5">
          <Button
            onClick={handleClose}
            className="w-full"
            type="button"
            variant="outline"
          >
            Batal
          </Button>
          <Button className="w-full">Simpan</Button>
        </div>
      </Form>
    </Modal>
  );
}

export default StudentBehaviourModal;
