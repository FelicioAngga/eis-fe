import { Modal } from "antd";
import Form from "../../../components/Form";
import { useForm } from "react-hook-form";
import { Input } from "../../../components/input/Input";
import useYupValidationResolver from "../../../hooks/useYupValidationResolver";
import * as Yup from "yup";
import Button from "../../../components/Button";

interface AddSubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function AddSubjectModal({ isOpen, onClose }: AddSubjectModalProps) {
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

  const handleSubmit = async (data: any) => {
    console.log(data);
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
          <Input type="text" name="name" placeholder="Nama" label="Nama" />
          <div className="flex gap-4 mt-5">
            <Button className="w-full" variant="outline">Batal</Button>
            <Button className="w-full">Tambah</Button>
          </div>
        </div>
      </Form>
    </Modal>
  );
}

export default AddSubjectModal;
