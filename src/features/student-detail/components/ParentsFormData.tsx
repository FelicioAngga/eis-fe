import * as Yup from 'yup';
import useYupValidationResolver from '../../../hooks/useYupValidationResolver';
import { useForm } from 'react-hook-form';
import Form from '../../../components/Form';
import { Input } from '../../../components/input/Input';
import Button from '../../../components/Button';
import { GuardianModel } from '../../../api-hooks/registration/models/RegistrationModel';
import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAlert } from '../../../contexts/AlertContext';
import { useQueryClient } from '@tanstack/react-query';
import { useCreateGuardian, useUpdateGuardian } from '../../../api-hooks/students/api';
import dayjs from 'dayjs';

interface ParentsFormDataProps {
  setParentsFormData: React.Dispatch<React.SetStateAction<GuardianModel[]>>;
  setCurrentTab: React.Dispatch<React.SetStateAction<string>>
  parentsFormData: GuardianModel[];
}

function ParentsFormData({ parentsFormData, setCurrentTab, setParentsFormData }: ParentsFormDataProps) {
  const { id } = useParams();
  const { showAlert } = useAlert();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const yupSchema = Yup.object().shape({
    name: Yup.string().required('Nama Ayah tidak boleh kosong'),
    place_of_birth: Yup.string().required('Tempat lahir Ayah tidak boleh kosong'),
    date_of_birth: Yup.date().required('Tanggal lahir Ayah tidak boleh kosong').typeError('Tanggal lahir tidak valid'),
    religion: Yup.string().required('Agama Ayah tidak boleh kosong'),
    highest_education: Yup.string().required('Pendidikan tertinggi Ayah tidak boleh kosong'),
    job: Yup.string(),
    phone: Yup.string().required('No telepon Ayah tidak boleh kosong'),
    momName: Yup.string().required('Nama Ibu tidak boleh kosong'),
    momPlaceOfBirth: Yup.string().required('Tempat lahir Ibu tidak boleh kosong'),
    momDateOfBirth: Yup.date().required('Tanggal lahir Ibu tidak boleh kosong').typeError('Tanggal lahir Ibu tidak valid'),
    momReligion: Yup.string().required('Agama Ibu tidak boleh kosong'),
    momHighestEducation: Yup.string().required('Pendidikan tertinggi Ibu tidak boleh kosong'),
    momJob: Yup.string(),
    momPhone: Yup.string().required('No telepon Ibu tidak boleh kosong'),
  });

  const resolver = useYupValidationResolver(yupSchema);
  const defaultValues = useMemo(() => {
    const dadData = parentsFormData?.find(g => g.relation === 'father');
    const momData = parentsFormData?.find(g => g.relation === 'mother');
    return {
      id: dadData?.id || '',
      name: dadData?.name,
      place_of_birth: dadData?.place_of_birth,
      date_of_birth: dadData?.date_of_birth,
      religion: dadData?.religion,
      highest_education: dadData?.highest_education,
      job: dadData?.job,
      phone: dadData?.phone,
      momId: momData?.id || '',
      momName: momData?.name,
      momPlaceOfBirth: momData?.place_of_birth,
      momDateOfBirth: momData?.date_of_birth,
      momReligion: momData?.religion,
      momHighestEducation: momData?.highest_education,
      momJob: momData?.job,
      momPhone: momData?.phone,
    }
  }, [parentsFormData]);

  const methods = useForm({
    mode: 'onSubmit',
    defaultValues,
    resolver,
  });

  const { mutateAsync: updateGuardian } = useUpdateGuardian();
  const { mutateAsync: mutateGuardian } = useCreateGuardian();

  async function handleSubmit(data: any) {
    let guardians: GuardianModel[] = [];
    guardians.push({
      id: data.id || undefined,
      name: data.name,
      place_of_birth: data.place_of_birth,
      date_of_birth: dayjs(data.date_of_birth).format('YYYY-MM-DD'),
      religion: data.religion,
      highest_education: data.highest_education,
      job: data.job,
      phone: data.phone,
      address: data.address,
      relation: 'father',
    });
    guardians.push({
      id: data.momId || undefined,
      name: data.momName,
      place_of_birth: data.momPlaceOfBirth,
      date_of_birth: dayjs(data.momDateOfBirth).format('YYYY-MM-DD'),
      religion: data.momReligion,
      highest_education: data.momHighestEducation,
      job: data.momJob,
      phone: data.momPhone,
      address: data.address,
      relation: 'mother',
    });

    if (id) {
      guardians = guardians.map(g => ({ ...g, date_of_birth: dayjs(g.date_of_birth).format('YYYY-MM-DD') }));
      const response = await updateGuardian(guardians);
      if (response[1].status === 200) {
        showAlert({
          title: 'Berhasil',
          message: "Data berhasil diperbarui.",
          type: 'success',
        });
        queryClient.invalidateQueries({
          queryKey: ['students', parseInt(id)],
        });
        navigate(`/student-data`);
      }
    } else {
      setParentsFormData(guardians);
      const responseGuard = await mutateGuardian(guardians);
      if (responseGuard[0].status === 200) {
        showAlert({
          title: 'Berhasil',
          message: "Data orang tua berhasil disimpan.",
          type: 'success',
        });
        setCurrentTab('guardian');
      } else {
        showAlert({
          title: 'Gagal',
          message: responseGuard[0].message || "Gagal menyimpan data orang tua.",
          type: 'error',
        });
      }
    }
  }

  return (
    <Form methods={methods} onSubmit={handleSubmit}>
      <div className="mt-5 flex gap-4 mx-auto w-full">
        <div className="flex flex-col gap-3 w-full">
          <p className="font-medium">Data Ayah Siswa</p>
          <Input 
            type="text"
            name="name"
            label="Nama Ayah"
            placeholder='Nama Ayah'
            required
          />
          <Input 
            type="text"
            name="place_of_birth"
            label="Tempat Lahir"
            placeholder='Tempat Lahir Ayah'
            required
          />
          <Input 
            type="date"
            name="date_of_birth"
            label="Tanggal Lahir"
            placeholder='Tanggal Lahir Ayah'
            maxDate={new Date()}
            required
          />
          <Input 
            type="select"
            name="religion"
            label="Agama"
            placeholder="Agama Ayah"
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
          <Input 
            type="select"
            name="highest_education"
            label="Pendidikan Tertinggi"
            placeholder="Pendidikan Tertinggi Ayah"
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
            required
          />
          <Input 
            type="text"
            name="address"
            label="Alamat"
            placeholder="Alamat Ayah"
            required
          />
          <Input 
            type="text"
            name="job"
            label="Pekerjaan"
            placeholder="Pekerjaan Ayah"
          />
          <Input 
            type="number"
            name="phone"
            label="No Telepon"
            placeholder="No Telepon Ayah"
            required
          />
        </div>

        <div className="flex flex-col gap-3 w-full">
          <p className="font-medium">Data Ibu Siswa</p>
          <Input 
            type="text"
            name="momName"
            label="Nama Ibu"
            placeholder='Nama Ibu'
            required
          />
          <Input 
            type="text"
            name="momPlaceOfBirth"
            label="Tempat Lahir"
            placeholder='Tempat Lahir Ibu'
            required
          />
          <Input 
            type="date"
            name="momDateOfBirth"
            label="Tanggal Lahir"
            placeholder='Tanggal Lahir Ibu'
            maxDate={new Date()}
            required
          />
          <Input 
            type="select"
            name="momReligion"
            label="Agama"
            placeholder="Agama Ibu"
            options={[
              { value: "Islam", label: "Islam" },
              { value: "Kristen Protestan", label: "Kristen Protestan" },
              { value: "Katolik", label: "Katolik" },
              { value: "Hindu", label: "Hindu" },
              { value: "Buddha", label: "Buddha" },
              { value: "Konghucu", label: "Konghucu" },
            ]}
            required
          />
          <Input 
            type="select"
            name="momHighestEducation"
            label="Pendidikan Tertinggi"
            placeholder="Pendidikan Tertinggi Ibu"
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
            required
          />
          <Input 
            type="text"
            name="momAddress"
            label="Alamat"
            placeholder="Alamat Ibu"
            required
          />
          <Input 
            type="text"
            name="momJob"
            label="Pekerjaan"
            placeholder="Pekerjaan Ibu"
          />
          <Input 
            type="number"
            name="momPhone"
            label="No Telepon"
            placeholder="No Telepon Ibu"
            required
          />
        </div>
      </div>
      <Button className="w-fit px-20 mx-auto mt-10">{id ? "Simpan" : "Berikutnya"}</Button>
    </Form>
  );
}

export default ParentsFormData;