import { Modal } from "antd";
import Form from "../../../components/Form";
import { useForm } from "react-hook-form";
import useYupValidationResolver from "../../../hooks/useYupValidationResolver";
import * as Yup from "yup";
import { YearPicker } from "../../../components/YearPicker";
import Button from "../../../components/Button";
import { useCreateAcademicBatch } from "../../../api-hooks/class/api";
import { CreateAcademicModel } from "../../../api-hooks/class/models/ClassModel";
import { useAlert } from "../../../contexts/AlertContext";
import { useQueryClient } from "@tanstack/react-query";
import { Input } from "../../../components/input/Input";
import dayjs from "dayjs";

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
  async function handleSubmit(data: CreateAcademicModel) {
    const response = await mutateAsync({
      ...data,
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
      width={750}
      title="Tambah Batch Kelas Berdasarkan Tahun Ajaran"
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
          <Button onClick={onClose} type="button" variant="outline" className="w-full">Batal</Button>
          <Button className="w-full">Tambah</Button>
        </div>
      </Form>
    </Modal>
  );
}

export default BatchModal;
