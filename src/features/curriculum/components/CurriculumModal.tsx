import { Modal } from 'antd';
import Form from '../../../components/Form';
import { useQueryClient } from '@tanstack/react-query';
import { useAlert } from '../../../contexts/AlertContext';
import useYupValidationResolver from '../../../hooks/useYupValidationResolver';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { Input } from '../../../components/input/Input';
import { useCreateCurriculum, useCurriculumDetailQuery, useUpdateCurriculum } from '../../../api-hooks/curriculum/api';
import { useGradeQuery } from '../../../api-hooks/grade/api';
import Button from '../../../components/Button';
import { FiEdit, FiPlus } from 'react-icons/fi';
import { MdDelete } from 'react-icons/md';
import { useEffect, useState } from 'react';
import { CreateCurriculumModel, CurriculumSubjectModel } from '../../../api-hooks/curriculum/models/CurriculumModel';
import CurriculumSubjectModal from './CurriculumSubjectModal';
interface CurriculumModalProps {
  isOpen: boolean;
  onClose: () => void;
  curriculumId: number | null;
}

function CurriculumModal({ isOpen, curriculumId, onClose }: CurriculumModalProps) {
  const queryClient = useQueryClient();
  const { showAlert } = useAlert();
  const yupSchema = Yup.object().shape({
    name: Yup.string().required("Nama Kurikulum tidak boleh kosong"),
    level_id: Yup.string().required("Jenjang tidak boleh kosong"),
    grade: Yup.string().required("Tingkat tidak boleh kosong"),
  });

  const [curriculumSubjectEditData, setCurriculumSubjectEditData] = useState<CurriculumSubjectModel | null>(null);
  const [isCurriculumSubjectModalOpen, setIsCurriculumSubjectModalOpen] = useState(false);
  const [curriculumSubjectList, setCurriculumSubjectList] = useState<CurriculumSubjectModel[]>([]);

  const tingkatArray = [
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4" },
    { value: "5", label: "5" },
    { value: "6", label: "6" },
  ];

  const { data: curriculumDetail } = useCurriculumDetailQuery(curriculumId || 0);
  const { data: gradeData } = useGradeQuery({ pagination: { limit: 99999 }, search: "" });

  const resolver = useYupValidationResolver(yupSchema);
  const methods = useForm({
    mode: "onSubmit",
    resolver,
    defaultValues: {
      name: "",
      level_id: "",
      grade: "",
      competence1: "",
      competence2: "",
      competence3: "",
      competence4: "",
      subject_id: "",
    },
  });

  const handleDeleteCurriculumSubject = (subject_id: number) => {
    setCurriculumSubjectList((prev) => prev.filter((curriculumSubj) => curriculumSubj.subject_id !== subject_id));
  }

  const { mutateAsync: mutateCreate } = useCreateCurriculum();
  const { mutateAsync: mutateUpdate } = useUpdateCurriculum();
  
  const handleSubmit = async (data: CreateCurriculumModel) => {
    if (curriculumSubjectList.length === 0) {
      showAlert({
        title: "Gagal",
        type: "error",
        message: "Mata pelajaran kurikulum tidak boleh kosong",
      });
      return;
    }
    
    const mutateAsync = curriculumId ? mutateUpdate : mutateCreate;
    const response = await mutateAsync({
      id: curriculumId || undefined,
      name: data.name,
      level_id: parseInt(data.level_id.toString()),
      grade: data.grade,
      curriculum_subjects: curriculumSubjectList,
    });
    if (response.status === 200) {
      showAlert({
        title: "Berhasil",
        type: "success",
        message: "Berhasil menambah kurikulum",
      });
      queryClient.invalidateQueries({
        queryKey: ["curriculums"],
      });
      methods.reset();
      setCurriculumSubjectList([]);
      onClose();
    } else {
      showAlert({
        title: "Gagal",
        type: "error",
        message: response.error || "Gagal menambah kurikulum",
      });
    }
  }

  const handleClose = () => {
    onClose();
    methods.reset({
      name: "",
      level_id: "",
      grade: "",
    });
    setCurriculumSubjectList([]);
    setCurriculumSubjectEditData(null);
    setIsCurriculumSubjectModalOpen(false);
  }

  useEffect(() => {
    if (!curriculumDetail) return;
    setCurriculumSubjectList(curriculumDetail.data.curriculum_subjects || []);
    methods.reset({
      name: curriculumDetail?.data?.name,
      level_id: curriculumDetail.data?.level_id?.toString() || "",
      grade: curriculumDetail?.data?.grade || "",
    });
  }, [curriculumDetail]);

  return (
    <Modal
      open={isOpen}
      footer={null}
      onCancel={handleClose}
      maskClosable={false}
      centered
      width={600}
      title={curriculumId ? "Edit Kurikulum" : "Tambah Kurikulum"}
    >
      <Form methods={methods} onSubmit={handleSubmit}>
        <CurriculumSubjectModal
          isOpen={isCurriculumSubjectModalOpen}
          curriculumSubjectList={curriculumSubjectList}
          setCurriculumSubjectList={setCurriculumSubjectList}
          editData={curriculumSubjectEditData}
          onClose={() => {setIsCurriculumSubjectModalOpen(false); setCurriculumSubjectEditData(null);} }
        />
        <div className="flex flex-col gap-5">
          <Input
            type="text"
            name="name"
            placeholder='Masukkan nama kurikulum'
            label="Nama Kurikulum"
            required
          />
          <Input
            type="select"
            name="level_id"
            placeholder="Pilih Jenjang"
            label="Jenjang"
            disabled={!!curriculumId}
            required
            options={gradeData?.data.map((grade) => ({
              label: grade.name,
              value: grade.id?.toString() || "",
            }))} 
          />
          <Input
            type="select"
            name="grade"
            placeholder="Tingkat"
            label="Tingkat"
            disabled={!!curriculumId}
            options={methods.watch("level_id") == "2" ? tingkatArray : tingkatArray.slice(0, 3)}
            required
          />

          <div className="mb-8">
            <div className="flex gap-4 items-center mb-2">
              <p className='font-medium text-base'>Mata Pelajaran Kurikulum</p>
              <div 
                onClick={() => setIsCurriculumSubjectModalOpen(true)} 
                className="flex gap-2 items-center bg-blue rounded-full px-3 py-1.5 cursor-pointer hover:bg-blue-500 text-white transition-all"
              >
                <div className='p-1 bg-white rounded-full'><FiPlus className='size-4 text-black' /></div>
                <p>Tambah Mata Pelajaran</p>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              {curriculumSubjectList.map((subject, index) => (
                <div key={index} className="border bg-blue-100 border-blue-400 w-fit px-3 py-1.5 rounded-full flex items-center gap-2">
                  <p>{subject?.subject}</p>
                  <FiEdit onClick={() => { setCurriculumSubjectEditData(subject); setIsCurriculumSubjectModalOpen(true) }} className='shrink-0 size-4 cursor-pointer' />
                  <MdDelete onClick={() => handleDeleteCurriculumSubject(subject.subject_id)} className='text-danger shrink-0 size-4 cursor-pointer' />
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-6 justify-between">
            <Button className="w-full" type="button" variant="outline" onClick={handleClose}>Batal</Button>
            <Button className="w-full">Simpan</Button>
          </div>
        </div>
      </Form>
    </Modal>
  )
}

export default CurriculumModal;
