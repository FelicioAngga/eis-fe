import { useQueryClient } from '@tanstack/react-query';
import { Modal } from 'antd';
import { useForm } from 'react-hook-form';
import { useAlert } from '../../../contexts/AlertContext';
import useYupValidationResolver from '../../../hooks/useYupValidationResolver';
import * as Yup from 'yup';
import Button from '../../../components/Button';
import Form from '../../../components/Form';
import { Input } from '../../../components/input/Input';
import { useCreateDocumentType } from '../../../api-hooks/document-type/api';

interface AddDocTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function AddDocTypeModal({ isOpen, onClose }: AddDocTypeModalProps) {
  const queryClient = useQueryClient();
  const { showAlert } = useAlert();
  const yupSchema = Yup.object().shape({
    name: Yup.string().required("Nama Tipe Dokumen tidak boleh kosong"),
    description: Yup.string(),
  });

  const resolver = useYupValidationResolver(yupSchema);
  const methods = useForm({
    mode: "onSubmit",
    resolver,
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const { formState: { isValid } } = methods;

  const { mutateAsync, isPending } = useCreateDocumentType();

  const handleSubmit = async (data: any) => {
    const response = await mutateAsync(data);
    if (response.status === 200) {
      showAlert({
        title: "Berhasil",
        type: "success",
        message: "Berhasil menambah tipe dokumen",
      });
      queryClient.invalidateQueries({
        queryKey: ["document-type"],
      });
      methods.reset();
      onClose();
    } else {
      showAlert({
        title: "Gagal",
        type: "error",
        message: response.error || "Gagal menambah tipe dokumen",
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
      title="Tambah Tipe Dokumen"
    >
      <Form methods={methods} onSubmit={handleSubmit}>
        <div>
          <div className="flex flex-col gap-4">
            <Input type="text" name="name" placeholder="Nama" label="Nama" required />
            <Input type="textarea" rows={3} name="description" placeholder="Deskripsi" label="Deskripsi" />
          </div>
          <div className="flex gap-4 mt-8">
            <Button type="button" onClick={onClose} className="w-full" variant="outline">Batal</Button>
            <Button className="w-full" disabled={isPending || !isValid}>Tambah</Button>
          </div>
        </div>
      </Form>
    </Modal>
  );
}

export default AddDocTypeModal;
