import { Modal } from 'antd';
import Form from '../../../components/Form';
import { useForm } from 'react-hook-form';
import useYupValidationResolver from '../../../hooks/useYupValidationResolver';
import * as Yup from 'yup';
import { Input } from '../../../components/input/Input';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { useClassQuery } from '../../../api-hooks/class/api';
import Button from '../../../components/Button';

interface TransferClassModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function TransferClassModal({ isOpen, onClose }: TransferClassModalProps) {
  const { classDetail } = useSelector((state: RootState) => state.classAcademic);
  const { data: classList } = useClassQuery({ pagination: { limit: 99999 }, search: "" });
  const yupSchema = Yup.object().shape({
    materials: Yup.string().required("Materi tidak boleh kosong"),
  });

  const resolver = useYupValidationResolver(yupSchema)
  const methods = useForm({
    mode: 'onSubmit',
    resolver,
    defaultValues: {
    }
  })

  const handleSubmit = async (data: any) => {

  }

  const handleClose = () => {
    onClose();
  }

  return (
    <Modal
      open={isOpen}
      footer={null}
      onCancel={handleClose}
      maskClosable={false}
      centered
      title="Pindah Kelas"
    >
      <Form methods={methods} onSubmit={handleSubmit}>
        <div className="font-medium">
          <p>Kelas Sebelumnya</p>
          <p className="mb-5">{classDetail?.display_name}</p>
          <Input
            type="select"
            name="academic_id"
            label="Kelas"
            placeholder="Pilih Kelas" 
            options={classList?.data.map(item => ({
              label: item.display_name,
              value: item.id?.toString() || '',
            }))}
          />
        </div>
        <div className="flex gap-5 mt-5">
          <Button className="w-full" type="button" variant="outline">Batal</Button>
          <Button className="w-full">Simpan</Button>
        </div>
      </Form>
    </Modal>
  )
}

export default TransferClassModal;
