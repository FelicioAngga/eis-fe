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

interface ManualAcademicModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function ManualAcademicModal({ isOpen, onClose }: ManualAcademicModalProps) {
  const { showAlert } = useAlert();
  const queryClient = useQueryClient();
  const { data: teacherData } = useTeacherQuery({ pagination: { limit: 99999 }, search: "" });
  const { data: configClassData } = useConfigClassQuery({ pagination: { limit: 99999 }, search: "" });

  const yupSchema = Yup.object().shape({
    start_year: Yup.string().required("Tahun mulai tidak boleh kosong"),
    classroom_id: Yup.string().required("Kelas tidak boleh kosong"),
    homeroom_teacher_id: Yup.string().required("Wali kelas tidak boleh kosong"),
    major: Yup.string().required("Jurusan tidak boleh kosong"),
  });

  const resolver = useYupValidationResolver(yupSchema);
  const methods = useForm({
    mode: "onSubmit",
    defaultValues: {
      start_year: new Date().getFullYear().toString(),
      classroom_id: "",
      homeroom_teacher_id: "",
      major: "General",
    },
    resolver,
  });

  const { mutateAsync } = useCreateAcademic();
  async function handleSubmit(data: CreateAcademicModel) {
    const configClassName = configClassData?.data.find(item => item.id === parseInt(data.classroom_id.toString()))?.display_name || "";
    const response = await mutateAsync({
      ...data,
      display_name: `T.A.${data.start_year}/${+data.start_year + 1} - ${configClassName}`,
      classroom_id: parseInt(data.classroom_id.toString()),
      homeroom_teacher_id: parseInt(data.homeroom_teacher_id.toString()),
      end_year: (+data.start_year + 1).toString(),
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

  function onCloseModal() {
    methods.reset();
    onClose();
  }

  return (
    <Modal
      open={isOpen}
      footer={null}
      onCancel={onCloseModal}
      maskClosable={false}
      centered
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
            name="major"
            label="Jurusan"
            placeholder="Pilih Jurusan"
            options={[
              { label: "General", value: "General" },
              { label: "IPA", value: "IPA" },
              { label: "IPS", value: "IPS" },
            ]}
          />
          <Input
            type="select"
            name="classroom_id"
            label="Kelas"
            placeholder="Pilih Kelas"
            options={configClassData?.data.map((item) => ({
              label: item.display_name,
              value: item.id?.toString() || "",
            })) || []}
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
          />
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
