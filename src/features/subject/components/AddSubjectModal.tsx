import { Modal } from "antd";
import Form from "../../../components/Form";
import { useForm } from "react-hook-form";
import { Input } from "../../../components/input/Input";
import useYupValidationResolver from "../../../hooks/useYupValidationResolver";
import * as Yup from "yup";
import Button from "../../../components/Button";
import { useCreateSubject } from "../../../api-hooks/subjects/api";
import { useQueryClient } from "@tanstack/react-query";
import { useAlert } from "../../../contexts/AlertContext";

interface AddSubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function AddSubjectModal({ isOpen, onClose }: AddSubjectModalProps) {
  const queryClient = useQueryClient();
  const { showAlert } = useAlert();
  const yupSchema = Yup.object().shape({
    name: Yup.string().required("Nama Mata Pelajaran tidak boleh kosong"),
  });

  const resolver = useYupValidationResolver(yupSchema);
  const methods = useForm({
    mode: "onSubmit",
    resolver,
    defaultValues: {
      name: "",
    },
  });

  const { formState: { isValid } } = methods;

  const { mutateAsync, isPending } = useCreateSubject();

  const handleSubmit = async (data: any) => {
    const response = await mutateAsync(data);
    if (response.status === 200) {
      showAlert({
        title: "Berhasil",
        type: "success",
        message: "Berhasil menambah mata pelajaran",
      });
      queryClient.invalidateQueries({
        queryKey: ["subjects"],
      });
    } else {
      showAlert({
        title: "Gagal",
        type: "error",
        message: response.error || "Gagal menambah mata pelajaran",
      });
    }
  };

  return (
    <Modal
      open={isOpen}
      footer={null}
      onCancel={onClose}
      maskClosable={false}
      centered
      title="Tambah Mata Pelajaran"
    >
      <Form methods={methods} onSubmit={handleSubmit}>
        <div>
          <Input type="text" name="name" placeholder="Nama" label="Nama" required />
          <div className="flex gap-4 mt-8">
            <Button className="w-full" variant="outline">Batal</Button>
            <Button className="w-full" disabled={isPending || !isValid}>Tambah</Button>
          </div>
        </div>
      </Form>
    </Modal>
  );
}

export default AddSubjectModal;
