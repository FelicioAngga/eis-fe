import React, { useMemo } from "react";
import Form from "../../../components/Form";
import { Input } from "../../../components/input/Input";
import { useForm } from "react-hook-form";
import Button from "../../../components/Button";
import { GuardianModel } from "../../../api-hooks/registration/models/RegistrationModel";
import { StudentModel } from "../../../api-hooks/students/models/StudentModel";
import { useCreateGuardian, useUpdateGuardian } from "../../../api-hooks/students/api";
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

function GuardianFormData({ guardianFormData, studentFormData, setCurrentTab }: GuardianFormDataProps) {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const yupSchema = Yup.object().shape({
    name: Yup.string(),
    place_of_birth: Yup.string(),
    date_of_birth: Yup.date(),
    religion: Yup.string(),
    highest_education: Yup.string(),
    address: Yup.string(),
    job: Yup.string(),
    phone: Yup.string(),
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
      address: guardianData?.address,
      phone: guardianData?.phone,
    }
  }, [guardianFormData])

  const methods = useForm({
    mode: 'onSubmit',
    defaultValues,
    resolver,
  });

  const { mutateAsync: mutateGuardian, isPending: isGuardianPending } = useCreateGuardian();
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
  
  async function createGuardian(data: GuardianModel) {
    if (!data.name) {
      setCurrentTab('document');
    }
    const response = await mutateGuardian([{ ...data, date_of_birth: dayjs(data.date_of_birth).format('YYYY-MM-DD'), relation: 'guardian', student_id: studentFormData?.id || +(id || 0) }]);
    if (response[0]?.status === 200) {
      showAlert({
        title: 'Success',
        type: 'success',
        message: 'Data berhasil disimpan.',
      });
      setCurrentTab('document');
      queryClient.invalidateQueries({ queryKey: ['student'] });
    } else {
      if (!data.date_of_birth || !data.place_of_birth || !data.religion || !data.job || !data.highest_education || !data.address) {
        showAlert({
          title: 'Error',
          type: 'error',
          message: 'Mohon lengkapi data wali siswa.',
        });
        return;
      }
      queryClient.invalidateQueries({ queryKey: ['student'] });
      showAlert({
        title: 'Error',
        type: 'error',
        message: response[0]?.message || 'Gagal menyimpan data.',
      });
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
    const guardianData = guardianFormData?.find(g => g.relation === 'guardian');
    if (id && guardianData?.id) await updateGuardian(data);
    else await createGuardian(data);
  }

  return (
    <Form methods={methods} onSubmit={handleSubmit}>
      <div className="flex w-1/2 gap-4 mx-auto mt-5">
        <div className="flex flex-col w-full gap-3">
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
            name="address"
            label="Alamat"
            placeholder="Alamat"
          />
          <Input 
            type="select"
            name="highest_education"
            label="Pendidikan Tertinggi"
            placeholder="Pendidikan Tertinggi"
            options={[
              { value: 'Tidak Sekolah', label: 'Tidak Sekolah' },
              { value: 'TK', label: 'TK' },
              { value: 'SD', label: 'SD' },
              { value: 'SMP', label: 'SMP' },
              { value: 'SMA', label: 'SMA' },
              { value: 'S1', label: 'S1' },
              { value: 'S2', label: 'S2' },
              { value: 'S3', label: 'S3' }
            ]}
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
      <Button className="w-1/2 mx-auto mt-10" disabled={isGuardianPending}>Simpan</Button>
    </Form>
  );
}

export default GuardianFormData;
