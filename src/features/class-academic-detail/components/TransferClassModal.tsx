import { Modal } from 'antd';
import Form from '../../../components/Form';
import { useForm } from 'react-hook-form';
import useYupValidationResolver from '../../../hooks/useYupValidationResolver';
import * as Yup from 'yup';
import { Input } from '../../../components/input/Input';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { useClassQuery, useUpdateAcademic } from '../../../api-hooks/class/api';
import Button from '../../../components/Button';
import { StudentModel } from '../../../api-hooks/students/models/StudentModel';
import { useAlert } from '../../../contexts/AlertContext';
import { useQueryClient } from '@tanstack/react-query';

interface TransferClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentToTransfer?: StudentModel[];
  setStudentToTransfer?: React.Dispatch<React.SetStateAction<StudentModel[]>>;
  students?: StudentModel[];
}

function TransferClassModal({ isOpen, onClose, studentToTransfer, setStudentToTransfer }: TransferClassModalProps) {
  const { showAlert } = useAlert();
  const queryClient = useQueryClient();
  const { classDetail } = useSelector((state: RootState) => state.classAcademic);
  const { data: classList } = useClassQuery({ pagination: { limit: 99999 }, search: "" });
  const yupSchema = Yup.object().shape({
    academic_id: Yup.string().required("Kelas harus dipilih"),
  });

  const resolver = useYupValidationResolver(yupSchema)
  const methods = useForm({
    mode: 'onSubmit',
    resolver,
    defaultValues: {
      academic_id: classDetail?.id?.toString() || '',
    }
  })

  const { mutateAsync } = useUpdateAcademic();
  const handleSubmit = async (data: { academic_id: string }) => {
    const selectedClass = classList?.data.find(classItem => classItem.id?.toString() === data.academic_id);
    if (!selectedClass || !classDetail) {
      showAlert({
        title: 'Error',
        type: 'error',
        message: 'Kelas yang dipilih tidak valid.',
      });
      return;
    }
    const studentIds = studentToTransfer?.map(student => student.id);
    const response = await mutateAsync({
      ...selectedClass,
      students: [...(selectedClass?.students?.map(student => student?.id) || []), ...studentIds as any],
    });
    if (response.status === 200) {
      if (response.status === 200) {
        showAlert({
          title: 'Sukses',
          type: 'success',
          message: `Berhasil memindahkan siswa ke kelas ${selectedClass.display_name}`,
        });
        queryClient.invalidateQueries({
          queryKey: ['class', classDetail.id],
        });
        setStudentToTransfer?.([]);
        onClose();
      }
    }
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
            options={classList?.data.filter(classItem => classItem.id !== classDetail?.id).map(item => ({
              label: item.display_name,
              value: item.id?.toString() || '',
            }))}
          />
        </div>
        <div className="flex gap-5 mt-5">
          <Button onClick={handleClose} className="w-full" type="button" variant="outline">Batal</Button>
          <Button type="submit" className="w-full">Simpan</Button>
        </div>
      </Form>
    </Modal>
  )
}

export default TransferClassModal;
