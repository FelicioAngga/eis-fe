import React, { useEffect, useRef, useState } from 'react'
import { RootState } from '../../../store';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../../../components/Button';
import { changeActiveMenu } from '../classAcademicSlice';
import { FiEdit } from 'react-icons/fi';
import StudentBehaviourModal, { StudentBehaviourModalEditData } from './StudentBehaviourModal';
import { StudentModel } from '../../../api-hooks/students/models/StudentModel';
import { useCreateStudentBehaviour, useGetStudentBehaviour, useUpdateStudentBehaviour } from '../../../api-hooks/student-behaviour/api';
import { StudentBehaviourModel } from '../../../api-hooks/student-behaviour/models/StudentBehaviourModel';
import { useAlert } from '../../../contexts/AlertContext';
import { useQueryClient } from '@tanstack/react-query';
import { downloadStudentBehaviourExcel, handleImportStudentBehaviourExcel } from '../helpers/student-behaviour.excel';

interface StudentBehaviourProps {
  termId: number;
  setTermId: React.Dispatch<React.SetStateAction<number>>;
}


function StudentBehaviour({ setTermId, termId }: StudentBehaviourProps) {
  const {showAlert} = useAlert();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { classDetail } = useSelector((state: RootState) => state.classAcademic);
  const [editData, setEditData] = useState<StudentBehaviourModalEditData | null>(null);
  const [studentBehaviourData, setStudentBehaviourData] = useState<StudentBehaviourModel[]>([]);
  const [month, setMonth] = useState<string>("Bulanan 1");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: fetchedStudentBehaviour } = useGetStudentBehaviour(classDetail?.id || 0, termId);
  const inputFileRef = useRef<HTMLInputElement>(null);

  const handleBack = () => {
    dispatch(changeActiveMenu(""));
  };

  const openModal = (student: StudentModel, studentBehaviour?: StudentBehaviourModel | null) => {
    setEditData({
      ...studentBehaviour,
      id: studentBehaviour?.id || 0,
      academic_id: classDetail?.id || 0,
      term_id: termId,
      student_id: student.id,
      student_name: student.full_name,
      student_nis: student.nis,
    })
    setIsModalOpen(true);
  }

  const handleSaveModal = (data: StudentBehaviourModel) => {
    setStudentBehaviourData(prev => {
      const existingIndex = prev?.findIndex(item => item.student_id === data.student_id);
      if (existingIndex !== -1) {
        const updatedData = [...prev];
        updatedData[existingIndex] = data;
        return updatedData;
      }
      return [...prev, data];
    });
  }

  const { mutateAsync: mutateCreate } = useCreateStudentBehaviour();
  const { mutateAsync: mutateUpdate } = useUpdateStudentBehaviour();
  const handleSubmit = async () => {
    if (studentBehaviourData.length === 0) {
      showAlert({
        title: "Tidak ada data",
        message: "Tidak ada data yang disimpan",
        type: "error",
      });
      return;
    }
    const mutate = fetchedStudentBehaviour?.data?.some(item => item?.id) ? mutateUpdate : mutateCreate;
    const response = await mutate(studentBehaviourData);
    if (response.status === 201 || response.status === 200) {
      showAlert({
        title: "Berhasil",
        message: "Data kepribadian dan ekstrakurikuler siswa berhasil disimpan",
        type: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["student-behaviour", classDetail?.id, termId] });
    } else {
      showAlert({
        title: "Gagal",
        message: response.message || "Gagal menyimpan data",
        type: "error",
      });
    }
  }

  const handleDownload = () => {
    downloadStudentBehaviourExcel(studentBehaviourData, month);
  }
  
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;
    inputFileRef.current!.value = "";
    const result = await handleImportStudentBehaviourExcel(selectedFile, studentBehaviourData);
    setStudentBehaviourData([...result]);
  }

  useEffect(() => {
    if (!fetchedStudentBehaviour?.data) return;
    setStudentBehaviourData(fetchedStudentBehaviour.data);
  }, [fetchedStudentBehaviour?.data])
  
  return (
    <div>
      <StudentBehaviourModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editData={editData}
        month={month as "Bulanan 1" | "Bulanan 2"}
        handleSaveModal={handleSaveModal}
      />
      <div className="flex justify-between">
        <div>
          <p className="text-xl font-medium">Data Kepribadian dan Ekstrakurikuler Siswa</p>
          <table className="font-medium mt-5">
            <tbody>
              <tr>
                <td className="pr-8 pb-3">Kelas</td>
                <td className="pr-8 pb-3">:</td>
                <td className="pr-8 pb-3">{classDetail?.display_name}</td>
              </tr>
              <tr>
                <td className="pr-8 pb-3">Jenjang</td>
                <td className="pr-8 pb-3">:</td>
                <td className="pr-8 pb-3">{classDetail?.level_name}</td>
              </tr>
              <tr>
                <td className="pr-8 pb-3">Jurusan</td>
                <td className="pr-8 pb-3">:</td>
                <td className="pr-8 pb-3">{classDetail?.major}</td>
              </tr>
              <tr>
                <td className="pr-8 pb-3">Wali Kelas</td>
                <td className="pr-8 pb-3">:</td>
                <td className="pr-8 pb-3">{classDetail?.homeroom_teacher}</td>
              </tr>
              <tr>
                <td className="pr-8 pb-2">Semester</td>
                <td className="pr-8 pb-2">:</td>
                <td className="pr-8 pb-2">
                  <div className="relative pr-3">
                    <select
                      className="w-full border border-gray-300 appearance-none rounded-md px-3 py-2 cursor-pointer"
                      onChange={(e) => setTermId(parseInt(e.currentTarget.value))}
                      value={termId}
                    >
                      {classDetail?.terms?.map(term => 
                        <option value={term.id} key={term.id}>{term.name}</option>
                      )}
                    </select>
                    <div className="absolute inset-y-0 right-5 flex items-center px-2 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="pr-8 pb-2">Bulanan</td>
                <td className="pr-8 pb-2">:</td>
                <td className="pr-8 pb-2">
                  <div className="relative pr-3">
                    <select
                      className="w-full border border-gray-300 appearance-none rounded-md px-3 py-2 cursor-pointer"
                      onChange={(e) => setMonth(e.currentTarget.value)}
                      value={month}
                    >
                      <option value={"Bulanan 1"}>Bulanan 1</option>
                      <option value={"Bulanan 2"}>Bulanan 2</option>
                    </select>
                    <div className="absolute inset-y-0 right-5 flex items-center px-2 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="flex gap-5">
          <Button onClick={handleSubmit}>Simpan</Button>
          <Button variant="outline" onClick={handleBack}>Batal</Button>
        </div>
      </div>

      <div className="flex gap-4 justify-end">
        <Button onClick={handleDownload}>Download</Button>
        <Button onClick={() => inputFileRef.current?.click()}>Import</Button>
        <input
          multiple={false}
          type="file"
          accept=".xlsx, .xls"
          hidden
          ref={inputFileRef}
          onChange={handleFileChange}
        />
      </div>

      <table className="mt-5 w-full min-w-max font-medium text-sm">
        <tbody>
          <tr>
            <td className="border border-gray-400 px-3 py-2">No</td>
            <td className="border border-gray-400 px-3 py-2">NIS</td>
            <td className="border border-gray-400 px-3 py-2">Nama Siswa</td>
            <td className="border border-gray-400 px-3 py-2">Kelakuan</td>
            <td className="border border-gray-400 px-3 py-2">Kerapian</td>
            <td className="border border-gray-400 px-3 py-2">Kerajinan</td>
            <td colSpan={2} className="border border-gray-400 px-3 py-2 min-w-[100px]">Ekstrakurikuler</td>
            <td className="border border-gray-400 px-3 py-2">Aksi</td>
          </tr>

          {classDetail?.students?.map((student, index) => {
            const studentBehaviour = studentBehaviourData?.find(b => b.student_id === student.id);
            return (
              <React.Fragment key={student.id}>
                <tr>
                  <td rowSpan={2} className="border border-gray-400 px-3 py-2">{index + 1}</td>
                  <td rowSpan={2} className="border border-gray-400 px-3 py-2">{student.nis}</td>
                  <td rowSpan={2} className="border border-gray-400 px-3 py-2">{student.full_name}</td>
                  <td rowSpan={2} className="border border-gray-400 px-3 py-2">
                    {month === "Bulanan 1" ? studentBehaviour?.first_behaviour : studentBehaviour?.second_behaviour}
                  </td>
                  <td rowSpan={2} className="border border-gray-400 px-3 py-2">
                    {month === "Bulanan 1" ? studentBehaviour?.first_neatness : studentBehaviour?.second_neatness}
                  </td>
                  <td rowSpan={2} className="border border-gray-400 px-3 py-2">
                    {month === "Bulanan 1" ? studentBehaviour?.first_crafts : studentBehaviour?.second_crafts}
                  </td>
                  <td className="border border-gray-400 px-3 py-2 h-9">
                    {month === "Bulanan 1" ? studentBehaviour?.first_month_extracurricular_first : studentBehaviour?.second_month_extracurricular_first}
                  </td>
                  <td className="border border-gray-400 px-3 py-2 h-9">
                    {month === "Bulanan 1" ? studentBehaviour?.first_month_extracurricular_score_first : studentBehaviour?.second_month_extracurricular_score_first}
                  </td>
                  <td className="border border-gray-400 px-3 py-2" rowSpan={2}>
                    <FiEdit className="size-5 mx-auto cursor-pointer" onClick={() => openModal(student, studentBehaviour)} />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-400 px-3 py-2 h-9">
                    {month === "Bulanan 1" ? studentBehaviour?.first_month_extracurricular_second : studentBehaviour?.second_month_extracurricular_second}
                  </td>
                  <td className="border border-gray-400 px-3 py-2 h-9">
                    {month === "Bulanan 1" ? studentBehaviour?.first_month_extracurricular_score_second : studentBehaviour?.second_month_extracurricular_score_second}
                  </td>
                </tr>
              </React.Fragment>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default StudentBehaviour