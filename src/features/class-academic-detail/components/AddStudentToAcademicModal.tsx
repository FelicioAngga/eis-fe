import { Modal } from 'antd';
import Checkbox from '../../../components/Checkbox';
import { useState } from 'react';
import { useStudentsQuery, useUpdateAcademicIdByStudentIds } from '../../../api-hooks/students/api';
import Button from '../../../components/Button';
import { useAlert } from '../../../contexts/AlertContext';
import { useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { useClassDetail } from '../../../api-hooks/class/api';

interface AddStudentToAcademicModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function AddStudentToAcademicModal({ isOpen, onClose }: AddStudentToAcademicModalProps) {
  const { id } = useParams();
  const { showAlert } = useAlert();
  const queryClient = useQueryClient();
  const [searchValue, setSearchValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudentIds, setSelectedStudentIds] = useState<number[]>([]);
  const { data: studentData } = useStudentsQuery({ pagination: { limit: 999999 }, search: searchTerm });
  const { data: classDetail, refetch } = useClassDetail(id ? parseInt(id) : 0);
  
  const onSearch = () => {
    setSearchTerm(searchValue);
  }

  const { mutateAsync } = useUpdateAcademicIdByStudentIds();
  const handleSubmit = async () => {
    if (selectedStudentIds.length === 0) {
      showAlert({
        title: "Peringatan",
        type: "error",
        message: "Pilih minimal satu siswa untuk ditambahkan ke kelas akademik."
      });
      return;
    }

    const response = await mutateAsync({
      academic_id: classDetail?.data.id || 0,
      student_ids: selectedStudentIds,
    });
    if (response.status === 200) {
      refetch();
      queryClient.invalidateQueries({ queryKey: ["class", id] });
      showAlert({
        title: "Sukses",
        type: "success",
        message: "Siswa berhasil ditambahkan ke kelas akademik."
      });
      handleClose();
    } else {
      showAlert({
        title: "Error",
        type: "error",
        message: response.message || "Gagal menambahkan siswa ke kelas akademik."
      });
    }
  }

  const handleClose = () => {
    onClose();
    setSelectedStudentIds([]);
  }

  return (
    <Modal
      open={isOpen}
      footer={null}
      onCancel={handleClose}
      maskClosable={false}
      centered
      title="Tambah Murid ke Kelas Akademik"
      width={800}
    >
      <div className="border p-3 rounded-lg border-gray-300">
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded mb-3"
          placeholder="Cari Siswa..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSearch();
          }}
        />
        <div className="mt-5 font-medium text-sm flex py-3 border border-gray-300 bg-gray-100">
          <div className="w-1/12 flex justify-center"></div>
          <div className="w-1/12">No</div>
          <div className="w-5/12">Nama Lengkap</div>
          <div className="w-2/12">NISN</div>
          <div className="w-2/12">NIS</div>
        </div>
        
        <div className="overflow-y-auto max-h-[400px]">
          {studentData?.data.map((student, index) => (
            <div key={student.id} className="font-medium text-sm flex py-3 border-b border-r border-l border-gray-300">
              <div className="w-1/12 flex justify-center">
                <Checkbox
                  checked={selectedStudentIds.includes(student.id || 0)}
                  onChange={(e) => {
                    const isChecked = e.target.checked;
                    setSelectedStudentIds(prev => 
                      isChecked ? [...prev, student.id || 0] : prev.filter(id => id !== student.id)
                    );
                  }}
                />
              </div>
              <div className="w-1/12">{index + 1}</div>
              <div className="w-5/12">{student.full_name}</div>
              <div className="w-2/12">{student.nisn}</div>
              <div className="w-2/12">{student.nis}</div>
            </div>
          ))}
        </div>

        <div className="flex gap-5 mt-5">
          <Button onClick={handleClose} className="w-full" variant="outline">Batal</Button>
          <Button onClick={handleSubmit} className="w-full">Simpan</Button>
        </div>
      </div>
    </Modal>
  )
}

export default AddStudentToAcademicModal;
