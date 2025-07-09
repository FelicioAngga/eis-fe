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
import Checkbox from "../../../components/Checkbox";

interface AddSubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function AddSubjectModal({ isOpen, onClose }: AddSubjectModalProps) {
  const queryClient = useQueryClient();
  const { showAlert } = useAlert();
  const yupSchema = Yup.object().shape({
    code: Yup.string().required("Kode Mata Pelajaran tidak boleh kosong"),
    name: Yup.string().required("Nama Mata Pelajaran tidak boleh kosong"),
    isExtracurricular: Yup.boolean(),
  });

  const resolver = useYupValidationResolver(yupSchema);
  const methods = useForm({
    mode: "onSubmit",
    resolver,
    defaultValues: {
      name: "",
      code: "",
      isExtracurricular: false,
    },
  });

  const { formState: { isValid } } = methods;

  const { mutateAsync, isPending } = useCreateSubject();

  const handleSubmit = async (data: any) => {
    const response = await mutateAsync({
      ...data,
      is_extracurricular: data.isExtracurricular,
    });
    if (response.status === 200) {
      showAlert({
        title: "Berhasil",
        type: "success",
        message: "Berhasil menambah mata pelajaran",
      });
      queryClient.invalidateQueries({
        queryKey: ["subjects"],
      });
      methods.reset();
      onClose();
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
        <div className="flex flex-col gap-4">
          <Input type="text" name="code" placeholder="Kode" label="Kode" required />
          <Input type="text" name="name" placeholder="Nama" label="Nama" required />
          <div className="mt-2">
            <p className="mb-1 text-xs font-medium">(Centang jika ini adalah ekstrakurikuler)</p>
            <Checkbox
              label="Ekstrakurikuler"
              {...methods.register("isExtracurricular")}
            />
          </div>
          <div className="flex gap-4 mt-2">
            <Button type="button" onClick={onClose} className="w-full" variant="outline">Batal</Button>
            <Button className="w-full" disabled={isPending || !isValid}>Tambah</Button>
          </div>
        </div>
      </Form>
    </Modal>
  );
}

export default AddSubjectModal;
