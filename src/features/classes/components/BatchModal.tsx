import { Modal } from "antd";
import Form from "../../../components/Form";
import { useForm } from "react-hook-form";
import useYupValidationResolver from "../../../hooks/useYupValidationResolver";
import * as Yup from "yup";
import { YearPicker } from "../../../components/YearPicker";
import Button from "../../../components/Button";
import { useCreateAcademicBatch } from "../../../api-hooks/class/api";
import { AcademicBatchModel } from "../../../api-hooks/class/models/ClassModel";
import { useAlert } from "../../../contexts/AlertContext";
import { useQueryClient } from "@tanstack/react-query";

interface BatchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function BatchModal({ isOpen, onClose }: BatchModalProps) {
  const { showAlert } = useAlert();
  const queryClient = useQueryClient();
  const yupSchema = Yup.object().shape({
    start_year: Yup.string().required("Tahun mulai tidak boleh kosong"),
  });

  const resolver = useYupValidationResolver(yupSchema);
  const methods = useForm({
    mode: "onSubmit",
    defaultValues: {
      start_year: new Date().getFullYear().toString(),
    },
    resolver,
  });

  const { mutateAsync } = useCreateAcademicBatch();
  async function handleSubmit(data: AcademicBatchModel) {
    const response = await mutateAsync({
      ...data,
      end_year: (+data.start_year + 1).toString(),
    });
    if (response.status === 200) {
      queryClient.invalidateQueries({
        queryKey: ["class"],
      });
      showAlert({
        title: "Berhasil",
        type: "success",
        message: "Berhasil menambah batch tahun ajaran",
      });
      onCloseModal();
    } else {
      showAlert({
        title: "Gagal",
        type: "error",
        message: response.error || "Gagal menambah batch tahun ajaran",
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
      title="Tambah Batch Kelas Berdasarkan Tahun Ajaran"
    >
      <Form methods={methods} onSubmit={handleSubmit}>
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
        <div className="flex gap-5 mt-5">
          <Button type="button" variant="outline" className="w-full">Batal</Button>
          <Button className="w-full">Tambah</Button>
        </div>
      </Form>
    </Modal>
  );
}

export default BatchModal;
