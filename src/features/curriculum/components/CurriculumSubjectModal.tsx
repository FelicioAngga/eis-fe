import { Modal } from 'antd';
import { Input } from '../../../components/input/Input';
import { useSubjectsQuery } from '../../../api-hooks/subjects/api';
import Button from '../../../components/Button';
import { CurriculumSubjectModel } from '../../../api-hooks/curriculum/models/CurriculumModel';
import { useController, useFormContext } from 'react-hook-form';
import { useAlert } from '../../../contexts/AlertContext';
import { useEffect } from 'react';

interface CurriculumSubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  curriculumSubjectList: CurriculumSubjectModel[];
  setCurriculumSubjectList: React.Dispatch<React.SetStateAction<CurriculumSubjectModel[]>>;
  editData?: CurriculumSubjectModel | null;
}

function CurriculumSubjectModal({ isOpen, onClose, curriculumSubjectList, setCurriculumSubjectList, editData }: CurriculumSubjectModalProps) {
  const { showAlert } = useAlert();
  const { data: subjectData } = useSubjectsQuery({ pagination: { limit: 99999 }, search: "", is_extracurricular: false });
  const { control } = useFormContext();
  
  const { field: subject_id } = useController({ control, name: "subject_id" });
  const { field: competence1 } = useController({ control, name: "competence1" });
  const { field: competence2 } = useController({ control, name: "competence2" });
  const { field: competence3 } = useController({ control, name: "competence3" });
  const { field: competence4 } = useController({ control, name: "competence4" });

  const validateForm = () => {
    if (!subject_id.value || !competence1.value || !competence2.value || !competence3.value || !competence4.value) {
      showAlert({
        title: "Gagal",
        type: "error",
        message: "Semua field harus diisi",
      })
      return false;
    }
    return true;
  }

  const handleAddCurriculumSubject = () => {
    if (!validateForm()) return;
    const competence = {
      competence1: competence1.value,
      competence2: competence2.value,
      competence3: competence3.value,
      competence4: competence4.value,
    }
    if (editData) {
      setCurriculumSubjectList((prev) => prev.map((item) => 
        item.id === editData.id ? { 
          ...item, 
          subject_id: parseInt(subject_id.value),
          subject: subjectData?.data.find((subject) => subject.id.toString() === subject_id.value)?.name || "", competence: JSON.stringify(competence) } : item
      ));
    } else {
      setCurriculumSubjectList((prev) => [
        ...prev,
        {
          id: 0,
          subject_id: parseInt(subject_id.value),
          subject: subjectData?.data.find((subject) => subject.id.toString() === subject_id.value)?.name || "",
          competence: JSON.stringify(competence),
        },
      ]);
    }
    handleClose();
  }

  const handleClose = () => {
    onClose();
    subject_id.onChange("");
    competence1.onChange("");
    competence2.onChange("");
    competence3.onChange("");
    competence4.onChange("");
  }

  useEffect(() => {
    if (editData && isOpen) {
      subject_id.onChange(editData.subject_id.toString());
      const competence = JSON.parse(editData.competence);
      competence1.onChange(competence.competence1);
      competence2.onChange(competence.competence2);
      competence3.onChange(competence.competence3);
      competence4.onChange(competence.competence4);
    } else {
      subject_id.onChange("");
      competence1.onChange("");
      competence2.onChange("");
      competence3.onChange("");
      competence4.onChange("");
    }
  }, [editData, isOpen]);
  
  return (
    <Modal
      open={isOpen}
      footer={null}
      onCancel={handleClose}
      maskClosable={false}
      centered
      width={600}
      title="Tambah Mata Pelajaran Kurikulum"
    >
      <Input
        type="select"
        label="Mata Pelajaran" 
        name="subject_id"
        required
        placeholder="Pilih Mata Pelajaran"
        options={subjectData?.data
          ?.filter(x => !curriculumSubjectList?.some(currSubj => currSubj.subject_id === x.id) || x.id == editData?.subject_id)
          ?.map((subject) => ({
          label: `${subject.name}`,
          value: subject.id.toString(),
        }))}
      />
      <div className="flex items-center px-2 mt-4 border border-gray-300 rounded">
        <div className="w-14 h-[88px] flex flex-col items-center justify-center shrink-0 border-r border-gray-300 pr-2 mr-4">
          <p>Nilai</p>
          <p>90-100</p>
        </div>
        <div className="w-full py-2">
          <Input
            type="text"
            name="competence1"
            placeholder="Masukkan Kompetensi"
            label="Kompetensi"
            required
          />
        </div>
      </div>
      <div className="flex items-center px-2 mt-4 border border-gray-300 rounded">
        <div className="w-14 h-[88px] flex flex-col items-center justify-center shrink-0 border-r border-gray-300 pr-2 mr-4">
          <p>Nilai</p>
          <p>80-90</p>
        </div>
        <div className="w-full py-2">
          <Input
            type="text"
            name="competence2"
            placeholder="Masukkan Kompetensi"
            label="Kompetensi"
            required
          />
        </div>
      </div>
      <div className="flex items-center px-2 mt-4 border border-gray-300 rounded">
        <div className="w-14 h-[88px] flex flex-col items-center justify-center shrink-0 border-r border-gray-300 pr-2 mr-4">
          <p>Nilai</p>
          <p>70-80</p>
        </div>
        <div className="w-full py-2">
          <Input
            type="text"
            name="competence3"
            placeholder="Masukkan Kompetensi"
            label="Kompetensi"
            required
          />
        </div>
      </div>
      <div className="flex items-center px-2 mt-4 border border-gray-300 rounded">
        <div className="w-14 h-[88px] flex flex-col items-center justify-center shrink-0 border-r border-gray-300 pr-2 mr-4">
          <p>Nilai</p>
          <p>{"<"}70</p>
        </div>
        <div className="w-full py-2">
          <Input
            type="text"
            name="competence4"
            placeholder="Masukkan Kompetensi"
            label="Kompetensi"
            required
          />
        </div>
      </div>

      <div className="flex justify-between gap-6 mt-6">
        <Button className="w-full" type="button" variant="outline" onClick={handleClose}>Batal</Button>
        <Button onClick={handleAddCurriculumSubject} className="w-full" type="button">Tambah</Button>
      </div>
    </Modal>
  )
}

export default CurriculumSubjectModal;
