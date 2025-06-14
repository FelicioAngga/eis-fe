import { FiPrinter } from "react-icons/fi";
import Button from "../../../components/Button";
import Checkbox from "../../../components/Checkbox";
import TransferClassModal from "./TransferClassModal";
import { useState } from "react";
import AddStudentToAcademicModal from "./AddStudentToAcademicModal";
import { useClassDetail } from "../../../api-hooks/class/api";
import { useParams } from "react-router-dom";
import { StudentModel } from "../../../api-hooks/students/models/StudentModel";

interface ClassAcademicTableProps {
  termId: number;
}

function ClassAcademicTable({ termId }: ClassAcademicTableProps) {
  const { id } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const { data: classDetail } = useClassDetail(id ? parseInt(id) : 0);
  const [checkedStudents, setCheckedStudents] = useState<StudentModel[]>([]);

  function handlePrint(studentId: number) {
    window.open(`/class/student-report/${studentId}/${id}/${termId}`, "_blank");
  }

  return (
    <div className="border p-3 rounded-lg border-gray-300">
      <TransferClassModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        studentToTransfer={checkedStudents}
        students={classDetail?.data?.students || []}
        setStudentToTransfer={setCheckedStudents}
      />
      <AddStudentToAcademicModal 
        isOpen={isAddStudentModalOpen}
        onClose={() => setIsAddStudentModalOpen(false)}
      />
      <div className="flex items-center justify-between">
        <p className="font-semibold text-lg">Data Siswa</p>
        <div className="flex gap-5">
          <Button onClick={() => setIsAddStudentModalOpen(true)}>Tambah Murid</Button>
          <Button onClick={() => setIsModalOpen(true)}>Pindah Kelas</Button>
        </div>
      </div>

      <div className="mt-5 font-medium text-sm flex py-3 border border-gray-300 bg-gray-100">
        <div className="w-1/12 flex justify-center">
          <Checkbox
            checked={checkedStudents.length === classDetail?.data.students?.length}
            onChange={(e) => {
              const isChecked = e.target.checked;
              setCheckedStudents(isChecked ? classDetail?.data.students || [] : []);
            }} 
          />
        </div>
        <div className="w-1/12">No</div>
        <div className="w-5/12">Nama Lengkap</div>
        <div className="w-2/12">NISN</div>
        <div className="w-2/12">NIS</div>
        <div className="w-2/12">Cetak Rapor</div>
      </div>

      {classDetail?.data.students?.map((student, idx) => (
        <div key={idx} className="font-medium text-sm flex py-3 border-b border-r border-l border-gray-300">
          <div className="w-1/12 flex justify-center">
            <Checkbox
              checked={checkedStudents.some(s => s.id === student.id)}
              onChange={(e) => {
                const isChecked = e.target.checked;
                setCheckedStudents(prev => 
                  isChecked ? [...prev, student] : prev.filter(s => s.id !== student.id)
                );
              }} 
            />
          </div>
          <div className="w-1/12">{idx + 1}</div>
          <div className="w-5/12">{student.full_name}</div>
          <div className="w-2/12">{student.nisn || '-'}</div>
          <div className="w-2/12">{student.nis || '-'}</div>
          <div className="w-2/12 text-lg">
            <FiPrinter onClick={() => handlePrint(student.id || 0)} className="cursor-pointer" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default ClassAcademicTable;
