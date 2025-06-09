import { Modal } from 'antd';
import { useEffect, useMemo, useRef, useState } from 'react'
import { TeacherModel } from '../../../api-hooks/teacher/models/TeacherModel';
import { useForm } from 'react-hook-form';
import useYupValidationResolver from '../../../hooks/useYupValidationResolver';
import * as Yup from 'yup';
import Form from '../../../components/Form';
import defaultUser from '../../../assets/images/default-user.jpeg';
import { FiEdit } from 'react-icons/fi';
import { Input } from '../../../components/input/Input';
import Button from '../../../components/Button';
import { useCreateTeacher, useUpdateTeacher } from '../../../api-hooks/teacher/api';
import { fileToBase64 } from '../../../utils/base64';
import { useQueryClient } from '@tanstack/react-query';
import { useAlert } from '../../../contexts/AlertContext';
import { useGradeQuery } from '../../../api-hooks/grade/api';
import { useWorkingScheduleQuery } from '../../../api-hooks/working-schedule/api';

interface TeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  editData?: TeacherModel | null;
}

function TeacherModal({ isOpen, onClose, editData }: TeacherModalProps) {
  const { showAlert } = useAlert();
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const inputFileRef = useRef<any>(null);
  const { data: gradeData } = useGradeQuery({ pagination: { limit: 9999 }, search: "" });
  const { data: workSchedData } = useWorkingScheduleQuery({ pagination: { limit: 9999 }, search: "" });

  const yupSchema = Yup.object().shape({
    profile_pic: Yup.string(),
    identity_no: Yup.string().required("NIK tidak boleh kosong"),
    name: Yup.string().required("Nama tidak boleh kosong"),
    email: Yup.string().email("Email tidak valid").required("Email tidak boleh kosong"),
    phone: Yup.number().required("No Telepon tidak boleh kosong").typeError("No Telepon harus berupa angka"),
    address: Yup.string().required("Alamat tidak boleh kosong"),
    job_title: Yup.string().required("Jabatan tidak boleh kosong"),
    nuptk: Yup.string().required("NUPTK tidak boleh kosong"),
    level_id: Yup.string(),
    work_sched_id: Yup.string().required("Jadwal Kerja tidak boleh kosong"),
    machine_id: Yup.number().required("Id Mesin Absensi tidak boleh kosong").typeError("Id Mesin Absensi harus berupa angka"),
  });

  const resolver = useYupValidationResolver(yupSchema);
  const defaultValues = useMemo(() => {
    return {
      id: editData?.id || 0,
      profile_pic: editData?.profile_pic || "",
      identity_no: editData?.identity_no || "",
      name: editData?.name || "",
      email: editData?.email || "",
      phone: editData?.phone || "",
      address: editData?.address || "",
      job_title: editData?.job_title || "",
      nuptk: editData?.nuptk || "",
      level_id: editData?.level_id?.toString() || "",
      work_sched_id: editData?.work_sched_id || "",
      machine_id: editData?.machine_id || "",
    };
  }, [editData])

  const methods = useForm({
    mode: "onSubmit",
    resolver,
    defaultValues,
  });

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setFile(file);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }
  
  function handleClose() {
    methods.reset();
    URL.revokeObjectURL(preview as string);
    setPreview(null);
    onClose();
  }

  const { mutateAsync, isPending } = editData ? useUpdateTeacher() : useCreateTeacher();

  const handleSubmit = async (data: TeacherModel) => {
    let base64File = "";
    if (file) base64File = await fileToBase64(file);
    const response = await mutateAsync({
      ...data,
      phone: data.phone.toString(),
      profile_pic: base64File,
      level_id: data.level_id ? +data.level_id : undefined,
      work_sched_id: data.work_sched_id ? +data.work_sched_id : undefined,
    });
    if (response.status === 200) {
      showAlert({
        title: "Berhasil",
        type: "success",
        message: `Berhasil ${editData ? "mengedit" : "menambah"} dokumen`,
      });
      queryClient.invalidateQueries({
        queryKey: ["teachers"],
      });
      handleClose();
    } else {
      showAlert({
        title: "Gagal",
        type: "error",
        message: response.error || `Gagal ${editData ? "mengedit" : "menambah"} guru`,
      });
    }
  }

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (defaultValues) {
      timeoutId = setTimeout(() => {
        methods.reset(defaultValues);
      })
      setPreview(defaultValues.profile_pic || "");
    }
    return () => clearTimeout(timeoutId)
  }, [defaultValues, workSchedData])

  return (
    <Modal
      open={isOpen}
      footer={null}
      onCancel={handleClose}
      maskClosable={false}
      centered
      title={editData ? "Edit Guru" : "Tambah Guru"}
      width={600}
    >
      <Form methods={methods} onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4">
          <div className="relative size-20 mx-auto">
            <img src={preview || defaultUser} className="rounded-full object-cover size-20" />
            <input
              onChange={handleFileChange}
              ref={inputFileRef}
              type="file"
              className="hidden"
              multiple={false}
              accept='image/*'
            />
            <div onClick={() => inputFileRef.current.click()} className="rounded-full absolute right-0 bottom-0 bg-blue p-1 cursor-pointer">
              <FiEdit className="size-4 text-white" />
            </div>
          </div>

          <div className="mt-2 flex gap-4 justify-between">
            <div className="flex flex-col gap-4 w-full">
              <Input type="number" name="identity_no" label="NIK" placeholder="Masukkan NIK" required />
              <Input type="text" name="name" label="Nama Lengkap" placeholder="Masukkan nama lengkap" required />
              <Input type="text" name="email" label="Email" placeholder="Masukkan Email" required />
              <Input type="text" name="address" label="Alamat" placeholder="Masukkan Alamat" required />
              <Input type="text" name="nuptk" label="NUPTK" placeholder="Masukkan NUPTK" required />
            </div>
            <div className="flex flex-col gap-4 w-full">
              <Input type="number" name="phone" label="No Telepon" placeholder="Masukkan No Telepon" required />
              <Input type="text" name="job_title" label="Jabatan" placeholder="Masukkan Jabatan" required />
              <Input 
                type="select" 
                name="level_id" 
                label="Jenjang" 
                placeholder="Masukkan Jenjang"
                options={gradeData?.data.map((grade) => ({
                  value: grade?.id?.toString() || "",
                  label: grade.name,
                }))}
              />
              <Input 
                type="select" 
                name="work_sched_id" 
                label="Jadwal Kerja" 
                placeholder="Masukkan Jadwal Kerja" 
                options={workSchedData?.data.map((sched) => ({
                  value: sched?.id?.toString() || "",
                  label: sched.name,
                }))}
                required
              />
              <Input type="number" name="machine_id" label="Id Mesin Absensi" placeholder="Masukkan Id Mesin Absensi" required />
            </div>
          </div>

          <div className="flex gap-4 mt-5">
            <Button type="button" onClick={handleClose} className="w-full" variant="outline">Batal</Button>
            <Button className="w-full" disabled={isPending}>{editData ? "Edit" : "Tambah"}</Button>
          </div>
        </div>
      </Form>
    </Modal>
  )
}

export default TeacherModal;
