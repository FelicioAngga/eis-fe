import { Modal } from "antd";
import Form from "../../../components/Form";
import { useForm } from "react-hook-form";
import useYupValidationResolver from "../../../hooks/useYupValidationResolver";
import * as Yup from "yup";
import { YearPicker } from "../../../components/YearPicker";
import Button from "../../../components/Button";
import { useCreateAcademic } from "../../../api-hooks/class/api";
import { CreateAcademicModel } from "../../../api-hooks/class/models/ClassModel";
import { useAlert } from "../../../contexts/AlertContext";
import { useQueryClient } from "@tanstack/react-query";
import { Input } from "../../../components/input/Input";
import { useTeacherQuery } from "../../../api-hooks/teacher/api";
import { useConfigClassQuery } from "../../../api-hooks/config-class/api";
import { useMemo } from "react";
import { useCurriculumQuery } from "../../../api-hooks/curriculum/api";
import dayjs from "dayjs";

interface ManualAcademicModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function ManualAcademicModal({ isOpen, onClose }: ManualAcademicModalProps) {
  const { showAlert } = useAlert();
  const queryClient = useQueryClient();
  const { data: teacherData } = useTeacherQuery({ pagination: { limit: 99999 }, search: "" });
  const { data: configClassData } = useConfigClassQuery({ pagination: { limit: 99999 }, search: "" });
  const { data: curriculumData } = useCurriculumQuery({ pagination: { limit: 99999 }, search: "" });

  const yupSchema = Yup.object().shape({
    start_year: Yup.string().required("Tahun mulai tidak boleh kosong"),
    classroom_id: Yup.string().required("Kelas tidak boleh kosong"),
    homeroom_teacher_id: Yup.string().required("Wali kelas tidak boleh kosong"),
    major: Yup.string().required("Jurusan tidak boleh kosong"),
    curriculum_id: Yup.string().required("Kurikulum tidak boleh kosong"),
  });

  const resolver = useYupValidationResolver(yupSchema);
  const methods = useForm({
    mode: "onSubmit",
    defaultValues: {
      start_year: new Date().getFullYear().toString(),
      classroom_id: "",
      homeroom_teacher_id: "",
      curriculum_id: "",
      major: "General",
    },
    resolver,
  });

  const curriculumList = useMemo(() => {
    if (!methods.getValues('classroom_id')) return [];
    const selectedClassRoom = configClassData?.data.find(item => item.id === parseInt(methods.getValues('classroom_id')));
    return curriculumData?.data?.filter(x => selectedClassRoom?.level_id == x.level_id && selectedClassRoom.grade == x.grade)
    ?.map(item => ({
      label: item.display_name,
      value: item.id?.toString() || "",
    }));
  }, [methods.watch('classroom_id'), curriculumData]);

  const { mutateAsync } = useCreateAcademic();
  async function handleSubmit(data: CreateAcademicModel) {
    const configClassName = configClassData?.data.find(item => item.id === parseInt(data.classroom_id.toString()))?.display_name || "";
    const response = await mutateAsync({
      ...data,
      display_name: `T.A.${data.start_year}/${+data.start_year + 1} - ${configClassName}`,
      classroom_id: parseInt(data.classroom_id.toString()),
      curriculum_id: parseInt(data.curriculum_id.toString()),
      homeroom_teacher_id: parseInt(data.homeroom_teacher_id.toString()),
      end_year: (+data.start_year + 1).toString(),
      first_term_start_date: dayjs(data.first_term_start_date).format("YYYY-MM-DD"),
      first_term_end_date: dayjs(data.first_term_end_date).format("YYYY-MM-DD"),
      second_term_start_date: dayjs(data.second_term_start_date).format("YYYY-MM-DD"),
      second_term_end_date: dayjs(data.second_term_end_date).format("YYYY-MM-DD"),
    });
    if (response.status === 200) {
      queryClient.invalidateQueries({
        queryKey: ["class"],
      });
      showAlert({
        title: "Berhasil",
        type: "success",
        message: "Berhasil menambah tahun ajaran",
      });
      onCloseModal();
    } else {
      showAlert({
        title: "Gagal",
        type: "error",
        message: response.error || "Gagal menambah tahun ajaran",
      });
    }
  }

  const selectedLevel = useMemo(() => {
    const classroomId = methods.getValues('classroom_id');
    return configClassData?.data.find(item => item.id === parseInt(classroomId))?.level?.name || "";
  }, [methods.watch('classroom_id')]);

  function onCloseModal() {
    methods.reset();
    onClose();
  }

  const major = [
    { label: "General", value: "General" },
    { label: "IPA", value: "IPA" },
    { label: "IPS", value: "IPS" },
  ]

  return (
    <Modal
      open={isOpen}
      footer={null}
      onCancel={onCloseModal}
      maskClosable={false}
      centered
      width={750}
      title="Tambah Kelas Berdasarkan Tahun Ajaran"
    >
      <Form methods={methods} onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4">
          <div className="flex gap-5">
            <YearPicker
              name="start_year"
              label="Tahun Mulai Ajaran"
              maxYear={new Date().getFullYear()}
            />
            <div className="w-full">
              <p className="font-medium text-sm">Tahun Selesai Ajaran</p>
              <div className="font-medium h-full flex items-center pb-5">{+methods.watch('start_year') + 1}</div>
            </div>
          </div>
          <Input
            type="select"
            name="classroom_id"
            label="Kelas"
            placeholder="Pilih Kelas"
            options={configClassData?.data.map((item) => ({
              label: item.display_name,
              value: item.id?.toString() || "",
            })) || []}
            required
          />
          <Input 
            type="select"
            name="major"
            label="Jurusan"
            placeholder="Pilih Jurusan"
            options={selectedLevel.toString() === "SMA" ? major : major.slice(0, 1)}
            required
          />
          <Input
            type="select"
            name="homeroom_teacher_id"
            label="Wali Kelas"
            placeholder="Pilih Wali Kelas"
            options={teacherData?.data.map((item) => ({
              label: item.name,
              value: item.id?.toString() || "",
            })) || []}
            required
          />
          <Input
            type="select"
            name="curriculum_id"
            label="Kurikulum"
            placeholder="(Pilihan ini akan muncul jika kelas sudah dipilih)"
            options={curriculumList}
            required
          />
          <div className="flex gap-4">
            <Input
              type="date"
              name="first_term_start_date"
              label="Tanggal Mulai Semester 1"
              defaultDateValue={`${methods.getValues('start_year')}-01-01`}
              minDate={new Date(`${methods.getValues('start_year')}-01-01`)}
              maxDate={new Date(`${methods.getValues('start_year')}-12-31`)}
              placeholder="Pilih Tanggal"
              required
            />
            <Input
              type="date"
              name="first_term_end_date"
              label="Tanggal Selesai Semester 1"
              defaultDateValue={`${methods.getValues('start_year')}-07-01`}
              minDate={new Date(`${methods.getValues('start_year')}-01-01`)}
              maxDate={new Date(`${methods.getValues('start_year')}-12-31`)}
              placeholder="Pilih Tanggal"
              required
            />
          </div>
          <div className="flex gap-4">
            <Input
              type="date"
              name="second_term_start_date"
              label="Tanggal Mulai Semester 2"
              placeholder="Pilih Tanggal"
              defaultDateValue={`${+methods.getValues('start_year') + 1}-01-01`}
              minDate={new Date(`${+methods.getValues('start_year') + 1}-01-01`)}
              maxDate={new Date(`${+methods.getValues('start_year') + 1}-12-31`)}
              required
            />
            <Input
              type="date"
              name="second_term_end_date"
              label="Tanggal Selesai Semester 2"
              defaultDateValue={`${+methods.getValues('start_year') + 1}-07-01`}
              minDate={new Date(`${+methods.getValues('start_year') + 1}-01-01`)}
              maxDate={new Date(`${+methods.getValues('start_year') + 1}-12-31`)}
              placeholder="Pilih Tanggal"
              required
            />
          </div>
        </div>
        <div className="flex gap-5 mt-5">
          <Button onClick={onCloseModal} type="button" variant="outline" className="w-full">Batal</Button>
          <Button className="w-full">Tambah</Button>
        </div>
      </Form>
    </Modal>
  );
}

export default ManualAcademicModal;
