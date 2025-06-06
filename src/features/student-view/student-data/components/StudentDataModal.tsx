import { Modal } from "antd";
import { StudentModel } from "../../../../api-hooks/students/models/StudentModel";
import Form from "../../../../components/Form";
import { useForm } from "react-hook-form";
import { useAlert } from "../../../../contexts/AlertContext";
import { useQueryClient } from "@tanstack/react-query";
import useYupValidationResolver from "../../../../hooks/useYupValidationResolver";
import * as Yup from "yup";
import { Input } from "../../../../components/input/Input";
import Button from "../../../../components/Button";
import { useUpdateStudent } from "../../../../api-hooks/students/api";
import dayjs from "dayjs";

interface StudentDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  editData?: StudentModel;
}

function StudentDataModal({ isOpen, onClose, editData }: StudentDataModalProps) {
  const queryClient = useQueryClient();
  const { showAlert } = useAlert();
  const yupSchema = Yup.object().shape({
    phone: Yup.string().required("Nomor Telepon tidak boleh kosong"),
    address: Yup.string().required("Alamat tidak boleh kosong"),
  });

  const resolver = useYupValidationResolver(yupSchema);
  const methods = useForm({
    mode: "onSubmit",
    defaultValues: {
      address: editData?.address || "",
      phone: editData?.phone || "",
    },
    resolver,
  });

  const { mutateAsync, isPending } = useUpdateStudent();
  async function handleSubmit(data: { phone: string; address: string }) {
    if (!editData) return;
    const response = await mutateAsync({
      ...editData,
      date_of_birth: dayjs(editData.date_of_birth).format('YYYY-MM-DD'),
      phone: data.phone,
      address: data.address,
    })
    if (response.status !== 200) {
      showAlert({
        title: "Gagal",
        type: "error",
        message: response.error || "Gagal memperbarui data siswa",
      });
      return;
    }
    showAlert({
      title: "Berhasil",
      type: "success",
      message: "Data siswa berhasil diperbarui",
    });
    queryClient.invalidateQueries({
      queryKey: ["student-by-token"],
    });

    onClose();

  }

  return (
    <Modal
      open={isOpen}
      footer={null}
      onCancel={onClose}
      maskClosable={false}
      centered
      title="Edit Data Siswa"
    >
      <Form methods={methods} onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4">
          <Input
            name="phone"
            type="text"
            label="Nomor Telepon"
            placeholder="Masukkan nomor telepon"
          />
          <Input
            name="address"
            type="text"
            label="Alamat"
            placeholder="Masukkan alamat"
          />
        </div>
        <div className="mt-4 flex gap-5">
          <Button className="w-full" type="button" variant="outline">Batal</Button>
          <Button disabled={isPending} className="w-full">Simpan</Button>
        </div>
      </Form>
    </Modal>
  )
}

export default StudentDataModal;
