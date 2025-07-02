import Form from '../../../components/Form';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import useYupValidationResolver from '../../../hooks/useYupValidationResolver';
import { Input } from '../../../components/input/Input';
import { StudentModel } from '../../../api-hooks/students/models/StudentModel';
import Button from '../../../components/Button';
import { useEffect, useMemo, useRef, useState } from 'react';
import defaultUser from '../../../assets/images/default-user.jpeg';
import { FiEdit } from 'react-icons/fi';
import { fileToBase64 } from '../../../utils/base64';
import { useNavigate, useParams } from 'react-router-dom';
import { useAlert } from '../../../contexts/AlertContext';
import { useCreateStudent, useUpdateStudent } from '../../../api-hooks/students/api';
import dayjs from 'dayjs';
import { useQueryClient } from '@tanstack/react-query';

interface StudentFormDataProps {
  setStudentFormData: React.Dispatch<React.SetStateAction<StudentModel | null>>
  setCurrentTab: React.Dispatch<React.SetStateAction<string>>
  studentFormData: StudentModel | null;
}

function StudentFormData({ studentFormData, setCurrentTab, setStudentFormData }: StudentFormDataProps) {
  const { id } = useParams();
  const { showAlert } = useAlert();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(studentFormData?.profile_pic || null);
  const inputFileRef = useRef<any>(null);

  const yupSchema = Yup.object().shape({
    email: Yup.string().email('Email tidak valid').required('Email tidak boleh kosong'),
    full_name: Yup.string().required('Nama Siswa tidak boleh kosong'),
    identity_no: Yup.string(),
    nisn: Yup.string(),
    place_of_birth: Yup.string().required('Tempat lahir tidak boleh kosong'),
    date_of_birth: Yup.date().required('Tanggal lahir tidak boleh kosong').typeError('Tanggal lahir tidak valid'),
    religion: Yup.string().required('Agama tidak boleh kosong'),
    child_sequence: Yup.number().required('Anak ke tidak boleh kosong').typeError('Anak ke harus berupa angka'),
    number_of_siblings: Yup.number().required('Jumlah saudara tidak boleh kosong').typeError('Jumlah saudara harus berupa angka'),
    child_status: Yup.string().required('Status dalam keluarga tidak boleh kosong'),
    living_with: Yup.string().required('Tinggal bersama tidak boleh kosong'),
    address: Yup.string().required('Alamat rumah tidak boleh kosong'),
  });

  const resolver = useYupValidationResolver(yupSchema);
  const defaultValues = useMemo(() => {
    return {
      email: studentFormData?.email || "",
      profile_pic: studentFormData?.profile_pic || "",
      full_name: studentFormData?.full_name|| "",
      identity_no: studentFormData?.identity_no|| "",
      nisn: studentFormData?.nisn|| "",
      place_of_birth: studentFormData?.place_of_birth|| "",
      date_of_birth: studentFormData?.date_of_birth|| "",
      religion: studentFormData?.religion || "",
      child_sequence: studentFormData?.child_sequence|| "",
      number_of_siblings: studentFormData?.number_of_siblings|| "",
      child_status: studentFormData?.child_status|| "",
      living_with: studentFormData?.living_with|| "",
      address: studentFormData?.address|| "",
    }
  }, [studentFormData])

  const methods = useForm({
    mode: 'onSubmit',
    defaultValues,
    resolver,
  });

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setFile(file);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }

  const { mutateAsync: mutateUpdate } = useUpdateStudent();
  const { mutateAsync: mutateStudent } = useCreateStudent();

  async function handleSubmit(data: StudentModel) {
    const file64 = file ? await fileToBase64(file) : "";
    if (id) {
      const response = await mutateUpdate({
        ...data,
        id: parseInt(id),
        date_of_birth: dayjs(data.date_of_birth).format('YYYY-MM-DD'),
        profile_pic: file64,
      });
      if (response.status === 200) {
        showAlert({
          title: "Berhasil",
          message: response.message,
          type: "success",
        });
        queryClient.invalidateQueries({
          queryKey: ["students", parseInt(id)],
        });
        navigate("/student-data")
      }
    } else {
      const responseStudent = await mutateStudent({ 
        ...data, 
        profile_pic: file64,
        date_of_birth: dayjs(data.date_of_birth).format('YYYY-MM-DD') }
      );
      if (responseStudent.status === 200) {
        setStudentFormData({
          ...data,
          id: (responseStudent as any)?.created_id,
          profile_pic: file64,
        });
        showAlert({
          title: "Berhasil",
          message: "Data siswa berhasil disimpan.",
          type: "success",
        });
      }
      setCurrentTab('parents');
    }
  }

  useEffect(() => {
    if (!studentFormData) return;
    methods.reset({
      ...defaultValues,
      religion: studentFormData.religion || "",
      email: (studentFormData as any)?.user?.email || studentFormData?.email || "",
    });
    setPreview(studentFormData.profile_pic || null);
  }, [studentFormData]);

  return (
    <Form methods={methods} onSubmit={handleSubmit}>
      <div className="flex flex-col items-center">
        <div className="mt-5 flex flex-col gap-2 w-1/2">
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
          <Input 
            type="text"
            name="email"
            label="Email Siswa"
            placeholder='Email Siswa'
            disabled={!!id}
            required
          />
          <Input 
            type="text"
            name="full_name"
            label="Nama Siswa"
            placeholder='Nama Siswa'
            required
          />
          <Input 
            type="number"
            name="identity_no"
            label="NIK (Nomor Induk Kependudukan)"
            placeholder='NIK'
          />
          <Input 
            type="number"
            name="nisn"
            label="NISN (Nomor Induk Siswa Nasional)"
            placeholder='NISN'
          />
          <Input 
            type="text"
            name="place_of_birth"
            label="Tempat Lahir"
            placeholder='Tempat Lahir'
            required
          />
          <Input 
            type="date"
            name="date_of_birth"
            label="Tanggal Lahir"
            placeholder='Tanggal Lahir'
            maxDate={new Date()}
            required
          />
          <Input 
            type="select"
            name="religion"
            label="Agama"
            placeholder="Agama"
            options={[
              { value: 'Islam', label: 'Islam' },
              { value: 'Kristen Protestan', label: 'Kristen Protestan' },
              { value: 'Katolik', label: 'Katolik' },
              { value: 'Hindu', label: 'Hindu' },
              { value: 'Buddha', label: 'Buddha' },
              { value: 'Konghucu', label: 'Konghucu' },
            ]}
            required
          />
          <div className="flex gap-8">
            <Input 
              type="number"
              name="child_sequence"
              label="Anak ke"
              placeholder='Anak ke'
              required
            />
            <Input 
              type="number"
              name="number_of_siblings"
              label="Jumlah Saudara"
              placeholder='Jumlah Saudara'
              required
            />
          </div>
          <div className="flex gap-8">
            <Input 
              type="select"
              name="child_status"
              label="Status Dalam Keluarga"
              placeholder='Status diri dalam keluarga'
              options={[
                { value: 'Anak Kandung', label: 'Anak Kandung' },
                { value: 'Anak Angkat', label: 'Anak Angkat' },
                { value: 'Anak Tiri', label: 'Anak Tiri' },
              ]}
              required
            />
            <Input 
              type="text"
              name="living_with"
              label="Tinggal Bersama"
              placeholder='Tinggal Bersama'
              required
            />
          </div>
          <Input 
            type="text"
            name="address"
            label="Alamat Rumah"
            placeholder='Alamat Rumah'
            required
          />
        </div>
        <Button className="mt-5 w-1/2">{id ? "Simpan" : "Berikutnya"}</Button>
      </div>
    </Form>
  )
}

export default StudentFormData;
