import React, { useMemo } from "react";
import Form from "../../../components/Form";
import { Input } from "../../../components/input/Input";
import { useForm } from "react-hook-form";
import Button from "../../../components/Button";
import { GuardianModel } from "../../../api-hooks/registration/models/RegistrationModel";
import { StudentModel } from "../../../api-hooks/students/models/StudentModel";
import { useCreateGuardian, useCreateStudent, useUpdateGuardian } from "../../../api-hooks/students/api";
import { useAlert } from "../../../contexts/AlertContext";
import * as Yup from "yup";
import useYupValidationResolver from "../../../hooks/useYupValidationResolver";
import dayjs from "dayjs";
import { useNavigate, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

interface GuardianFormDataProps {
  setCurrentTab: React.Dispatch<React.SetStateAction<string>>;
  setStudentFormData: React.Dispatch<React.SetStateAction<StudentModel | null>>
  guardianFormData: GuardianModel[];
  studentFormData: StudentModel | null;
}

function GuardianFormData({ guardianFormData, studentFormData, setStudentFormData, setCurrentTab }: GuardianFormDataProps) {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const yupSchema = Yup.object().shape({
    name: Yup.string().required('Nama Wali tidak boleh kosong'),
    place_of_birth: Yup.string().required('Tempat lahir Wali tidak boleh kosong'),
    date_of_birth: Yup.date().required('Tanggal lahir Wali tidak boleh kosong').typeError('Tanggal lahir tidak valid'),
    religion: Yup.string().required('Agama Wali tidak boleh kosong'),
    highest_education: Yup.string().required('Pendidikan tertinggi Wali tidak boleh kosong'),
    job: Yup.string().required('Pekerjaan Wali tidak boleh kosong'),
    phone: Yup.string().required('No telepon Wali tidak boleh kosong'),
  });

  const resolver = useYupValidationResolver(yupSchema);
  const defaultValues = useMemo(() => {
    const guardianData = guardianFormData?.find(g => g.relation === 'guardian');
    return {
      id: guardianData?.id || '',
      name: guardianData?.name,
      place_of_birth: guardianData?.place_of_birth,
      date_of_birth: guardianData?.date_of_birth,
      religion: guardianData?.religion,
      highest_education: guardianData?.highest_education,
      job: guardianData?.job,
      phone: guardianData?.phone,
    }
  }, [guardianFormData])

  const methods = useForm({
    mode: 'onSubmit',
    defaultValues,
    resolver,
  });

  const { mutateAsync: mutateGuardian, isPending: isGuardianPending } = useCreateGuardian();
  const { mutateAsync: mutateStudent, isPending: isStudentPending} = useCreateStudent();
  const { mutateAsync: mutateUpdateGuardian } = useUpdateGuardian();

  async function updateGuardian(data: GuardianModel) {
    const response = await mutateUpdateGuardian([{ ...data, date_of_birth: dayjs(data.date_of_birth).format('YYYY-MM-DD') }])
    if (response[0]?.status === 200) {
      showAlert({
        title: 'Success',
        type: 'success',
        message: 'Data berhasil disimpan.',
      });
      queryClient.invalidateQueries({
        queryKey: ['students', id ? parseInt(id) : 0],
      });
      navigate(`/student-data`);
    }
  }

  async function createStudentAndGuardian(data: GuardianModel) {
    if (!studentFormData) return;
    let updatedGuardianData = [...guardianFormData];
    const existingGuardianIndex = updatedGuardianData.findIndex(g => g.relation === 'guardian');
    if (existingGuardianIndex > -1) {
      updatedGuardianData[existingGuardianIndex] = { ...updatedGuardianData[existingGuardianIndex], ...data };
    } else updatedGuardianData.push({ ...data, relation: 'guardian' });
    const responseStudent = await mutateStudent({ ...studentFormData, date_of_birth: dayjs(studentFormData.date_of_birth).format('YYYY-MM-DD') });

    if (responseStudent.status === 200) {
      setStudentFormData(prev => prev ? { ...prev, id: (responseStudent as any)?.created_id } : null)
      updatedGuardianData = updatedGuardianData.map(g => ({ 
        ...g, 
        student_id: (responseStudent as any).created_id,
        date_of_birth: dayjs(g.date_of_birth).format('YYYY-MM-DD'),
        address: studentFormData?.address || ' ',
      }));
      const responseGuardian = await mutateGuardian(updatedGuardianData);
      if (responseGuardian[2].status === 200) {
        showAlert({
          title: 'Success',
          type: 'success',
          message: 'Data berhasil disimpan.',
        });
        setCurrentTab('document');
      } else {
        showAlert({
          title: 'Error',
          type: 'error',
          message: 'Gagal menyimpan data.',
        });
      }
    }
  }

  async function handleSubmit(data: GuardianModel) {
    if (!studentFormData) {
      showAlert({
        title: 'Error',
        type: 'error',
        message: 'Data Siswa belum diisi. Silakan isi data siswa terlebih dahulu.',
      })
      return;
    }
    if (id) await updateGuardian(data);
    else await createStudentAndGuardian(data);
  }

  return (
    <Form methods={methods} onSubmit={handleSubmit}>
      <div className="mt-5 flex gap-4 mx-auto w-1/2">
        <div className="flex flex-col gap-3 w-full">
          <p className="font-medium">Data Wali Siswa</p>
          <Input
            type="text"
            name="name"
            label="Nama Wali"
            placeholder="Nama Wali"
          />
          <Input
            type="text"
            name="place_of_birth"
            label="Tempat Lahir"
            placeholder="Tempat Lahir Wali"
          />
          <Input
            type="date"
            name="date_of_birth"
            label="Tanggal Lahir"
            placeholder="Tanggal Lahir Wali"
            maxDate={new Date()}
          />
          <Input
            type="select"
            name="religion"
            label="Agama"
            placeholder="Agama Wali"
            options={[
              { value: "Islam", label: "Islam" },
              { value: "Kristen Protestan", label: "Kristen Protestan" },
              { value: "Katolik", label: "Katolik" },
              { value: "Hindu", label: "Hindu" },
              { value: "Buddha", label: "Buddha" },
              { value: "Konghucu", label: "Konghucu" },
            ]}
          />
          <Input
            type="text"
            name="highest_education"
            label="Pendidikan Tertinggi"
            placeholder="Pendidikan Tertinggi Wali"
          />
          <Input
            type="text"
            name="job"
            label="Pekerjaan"
            placeholder="Pekerjaan Wali"
          />
          <Input
            type="number"
            name="phone"
            label="No Telepon"
            placeholder="No Telepon Wali"
          />
        </div>
      </div>
      <Button className="mt-10 w-1/2 mx-auto" disabled={isGuardianPending || isStudentPending}>Simpan</Button>
    </Form>
  );
}

export default GuardianFormData;
