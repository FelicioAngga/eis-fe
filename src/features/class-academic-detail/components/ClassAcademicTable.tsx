import { FiPrinter, FiSave } from "react-icons/fi";
import Button from "../../../components/Button";
import Checkbox from "../../../components/Checkbox";
import TransferClassModal from "./TransferClassModal";
import { useState } from "react";
import AddStudentToAcademicModal from "./AddStudentToAcademicModal";
import { useClassDetail, useUpdateAcademic } from "../../../api-hooks/class/api";
import { useParams } from "react-router-dom";
import { StudentModel } from "../../../api-hooks/students/models/StudentModel";
import Swal from "sweetalert2";
import { useQueryClient } from "@tanstack/react-query";
import { useAlert } from "../../../contexts/AlertContext";
import { usePermissionAccess } from "../../../hooks/useAccessRight";
import { useAuth } from "../../../hooks/useAuth";

interface ClassAcademicTableProps {
  termId: number;
}

function ClassAcademicTable({ termId }: ClassAcademicTableProps) {
  const { id } = useParams();
  const { showAlert } = useAlert();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const { data: classDetail } = useClassDetail(id ? parseInt(id) : 0);
  const [checkedStudents, setCheckedStudents] = useState<StudentModel[]>([]);
  const { getUser } = useAuth();
  const { getPermissionAccess } = usePermissionAccess();

  function handlePrint(studentId: number) {
    window.open(`/class/student-report/${id}/${termId}/${studentId}`, "_blank");
  }
  function handlePrintMonthly(studentId: number) {
    window.open(`/class/student-monthly-report/${id}/${studentId}`, "_blank");
  }
  function handleMultiplePrint() {
    if (!checkedStudents.length) {
      showAlert({
        title: 'Peringatan',
        type: 'error',
        message: 'Pilih minimal satu siswa untuk dicetak rapor.',
      });
      return;
    }
    const studentIds = checkedStudents.map(s => s.id).join(',');
    window.open(`/class/student-report/${id}/${termId}/${studentIds}`, "_blank");
  }
  function handleMultipleMonthlyPrint() {
    if (!checkedStudents.length) {
      showAlert({
        title: 'Peringatan',
        type: 'error',
        message: 'Pilih minimal satu siswa untuk dicetak bulanan.',
      });
      return;
    }
    const studentIds = checkedStudents.map(s => s.id).join(',');
    window.open(`/class/student-monthly-report/${id}/${studentIds}`, "_blank");
  }

  const { mutateAsync } = useUpdateAcademic();
  const handleDelete = async () => {
    if (!classDetail?.data) return;
    if (!checkedStudents.length) {
      showAlert({
        title: 'Peringatan',
        type: 'error',
        message: 'Pilih minimal satu siswa untuk dihapus dari kelas.',
      });
      return;
    }

    const swalResponse = await Swal.fire({
      title: 'Konfirmasi',
      text: `Apakah Anda yakin ingin menghapus ${checkedStudents.length} murid?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Hapus',
      cancelButtonText: 'Batal',
    });
    if (!swalResponse.isConfirmed) return;
    const response = await mutateAsync({
      ...classDetail?.data,
      students: classDetail?.data.students?.
        filter(student => !checkedStudents.
          some(s => s.id === student.id))
          .map(student => student.id) as any || [],
    });
    if (response.status === 200) {
      setCheckedStudents([]);
      showAlert({
        title: 'Sukses',
        type: 'success',
        message: `Berhasil menghapus siswa dari kelas ${classDetail.data.display_name}`,
      });
      queryClient.invalidateQueries({queryKey: ['class', classDetail.data.id],});
      queryClient.invalidateQueries({queryKey: ['students']});
    }
  }

  function handleTransferClass() {
    if (!checkedStudents.length) {
      showAlert({
        title: 'Peringatan',
        type: 'error',
        message: 'Pilih minimal satu siswa untuk ditransfer dari kelas.',
      });
      return;
    }
    setIsModalOpen(true);
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
        {
          getPermissionAccess("academic_transfer").write && 
          <>
            <Button className="bg-danger" onClick={() => handleDelete()}>Hapus Murid</Button>
            <Button onClick={() => setIsAddStudentModalOpen(true)}>Tambah Murid</Button>
            <Button onClick={handleTransferClass}>Pindah Kelas</Button>
          </>
        }
        {
          getPermissionAccess('academic_print').read &&
          <>
            <Button onClick={handleMultiplePrint}>Cetak Rapor</Button>
            <Button onClick={handleMultipleMonthlyPrint}>Cetak Bulanan</Button>
          </>
        }
        </div>
      </div>

      <div className="mt-5 font-medium text-sm flex py-3 border border-gray-300 bg-gray-100">
        {getUser().role_name !== "Principal" &&
          <div className="w-1/12 flex justify-center">
            <Checkbox
              checked={checkedStudents.length === classDetail?.data.students?.length}
              onChange={(e) => {
                const isChecked = e.target.checked;
                setCheckedStudents(isChecked ? classDetail?.data.students || [] : []);
              }} 
            />
          </div>
        }
        <div className="w-1/12 flex justify-center">No</div>
        <div className="w-5/12">Nama Lengkap</div>
        <div className="w-2/12">NISN</div>
        <div className="w-2/12">NIS</div>
        {getPermissionAccess('academic_print').read && 
          <>
            <div className="w-1/12">Rapor</div>
            <div className="w-1/12">Bulanan</div>
          </>
        }
      </div>

      {classDetail?.data.students?.map((student, idx) => (
        <div key={idx} className="font-medium text-sm flex py-3 border-b border-r border-l border-gray-300">
          {getUser().role_name !== "Principal" && 
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
          }
          <div className="w-1/12 flex justify-center">{idx + 1}</div>
          <div className="w-5/12">{student.full_name}</div>
          <div className="w-2/12">{student.nisn || '-'}</div>
          <div className="w-2/12">{student.nis || '-'}</div>
          {getPermissionAccess('academic_print').read && 
            <>
              <div className="w-1/12 text-lg">
                <FiPrinter onClick={() => handlePrint(student.id || 0)} className="cursor-pointer" />
              </div>
              <div className="w-1/12 text-lg">
                <FiSave onClick={() => handlePrintMonthly(student.id || 0)} className="cursor-pointer" />
              </div>
            </>
          }
        </div>
      ))}
    </div>
  )
}

export default ClassAcademicTable;
