import { Modal } from 'antd';
import Form from '../../../components/Form';
import { useForm } from 'react-hook-form';
import { Input } from '../../../components/input/Input';
import { useTeacherQuery } from '../../../api-hooks/teacher/api';
import { TimeInputRHF } from '../../../components/input/TimeInputRHF';
import Button from '../../../components/Button';
import useYupValidationResolver from '../../../hooks/useYupValidationResolver';
import * as Yup from 'yup';
import { useCreateTeacherAbsence, useUpdateTeacherAbsence } from '../../../api-hooks/teacher-absence/api';
import { TeacherAbsenceCreateModel } from '../../../api-hooks/teacher-absence/models/TeacherAbsenceModel';
import dayjs from 'dayjs';
import { useAlert } from '../../../contexts/AlertContext';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import { formatDateToTime } from '../../../utils/formatDate';

interface TeacherAbsenceModalProps {
  isOpen: boolean;
  editData: TeacherAbsenceCreateModel | null;
  onClose: () => void;
}

function TeacherAbsenceModal({ isOpen, onClose, editData }: TeacherAbsenceModalProps) {
  const { showAlert } = useAlert();
  const queryClient = useQueryClient();
  const { data: teacherData } = useTeacherQuery({ pagination: { page: 1, limit: 99999 }, search: "" });

  const formSchema = Yup.object().shape({
    teacher_id: Yup.string().required("Guru wajib dipilih"),
    date: Yup.date().required("Tanggal absensi wajib diisi").typeError("Tanggal absensi harus berupa tanggal yang valid"),
    log_in_time: Yup.string().required("Scan masuk wajib diisi"),
    log_out_time: Yup.string().required("Scan keluar wajib diisi"),
    remark: Yup.string().optional(),
  });
  
  const defaultValues = useMemo(() => {
    return {
      teacher_id: editData?.teacher_id?.toString() || '',
      date: editData?.date ? dayjs(editData.date).format("YYYY-MM-DD") : '',
      log_in_time: formatDateToTime(editData?.log_in_time || '') || '',
      log_out_time: formatDateToTime(editData?.log_out_time || '') || '',
      remark: editData?.remark || '',
    }
  }, [editData])

  const resolver = useYupValidationResolver(formSchema);
  const methods = useForm({
    mode: "onSubmit",
    resolver,
    defaultValues,
  });

  const { mutateAsync: mutateCreate, isPending: isCreatePending } = useCreateTeacherAbsence();
  const { mutateAsync: mutateUpdate, isPending: isUpdatePending } = useUpdateTeacherAbsence();

  async function handleSubmit(data: TeacherAbsenceCreateModel) {
    const teacherId = data.teacher_id ? parseInt(data.teacher_id.toString()) : 0;
    const mutateAsync = editData ? mutateUpdate : mutateCreate;
    const response = await mutateAsync({
      ...data,
      id: editData?.id || undefined,
      teacher_id: teacherId,
      working_schedule_id: teacherData?.data?.find(teacher => teacher.id === teacherId)?.work_sched_id || 0,
      date: data.date ? dayjs(data.date).format("YYYY-MM-DD") : '',      
    });
    if (response.status === 200) {
      showAlert({
        title: "Berhasil",
        message: "Absensi guru berhasil disimpan.",
        type: "success",
      });
      queryClient.invalidateQueries({ queryKey: ['teacher-absences'] });
      onClose();
      methods.reset();
    } else {
      showAlert({
        title: "Gagal",
        message: response.message || "Terjadi kesalahan saat menyimpan absensi guru.",
        type: "error",
      });
    }
  }

  useEffect(() => {
    if (!defaultValues) return;
    const timeoutId = setTimeout(() => {
      methods.reset(defaultValues);
    });
    return () => clearTimeout(timeoutId);
  }, [defaultValues])

  return (
    <Modal
      open={isOpen}
      footer={null}
      onCancel={onClose}
      maskClosable={false}
      centered
      title={`${editData ? "Edit" : "Tambah"} Absensi Guru`}
    >
      <Form methods={methods} onSubmit={handleSubmit}>
        <div className="flex flex-col gap-5">
          <Input 
            type="select" 
            name="teacher_id" 
            label="Nama Guru - NUPTK" 
            placeholder="Pilih Guru"
            required
            options={teacherData?.data?.map(teacher => ({
              label: `${teacher.name} - ${teacher.nuptk}`,
              value: teacher.id.toString()
            }))}
          />
          <Input 
            type="date" 
            name="date" 
            label="Tanggal Absensi"
            placeholder="Pilih Tanggal"
            required
          />
          <div>
            <p className="font-medium mb-1">Scan Masuk <span className="text-danger">*</span></p>
            <TimeInputRHF name="log_in_time" />
          </div>
          <div>
            <p className="font-medium mb-1">Scan Keluar <span className="text-danger">*</span></p>
            <TimeInputRHF name="log_out_time" />
          </div>
          <Input 
            type="text"
            name="remark"
            label="Keterangan"
            placeholder="Keterangan (Opsional)"
          />
        </div>

        <div className="flex gap-5 mt-5">
          <Button onClick={onClose} className="w-full" variant="outline" type="button">Batal</Button>
          <Button disabled={isCreatePending || isUpdatePending} className="w-full">Simpan</Button>
        </div>
      </Form>
    </Modal>
  )
}

export default TeacherAbsenceModal;
