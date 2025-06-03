import { useDispatch, useSelector } from "react-redux";
import Button from "../../../components/Button";
import { changeActiveMenu } from "../classAcademicSlice";
import { FiEdit } from "react-icons/fi";
import React, { useEffect, useMemo, useState } from "react";
import ClassMarksModal, { ClassMarksModalEditData } from "./ClassMarksModal";
import { RootState } from "../../../store";
import { getUniqueSubjects } from "../helpers/unique-subject";
import { UniqueSubject } from "../../../api-hooks/class/models/ClassModel";
import { StudentModel } from "../../../api-hooks/students/models/StudentModel";
import { CreateStudentGradesDetailModel, StudentGradesEntryModel } from "../../../api-hooks/student-grades/models/StudentGradesModel";

function ClassMarks() {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { classDetail } = useSelector((state: RootState) => state.classAcademic);
  const [editData, setEditData] = useState<ClassMarksModalEditData | null>(null);
  const [studentMarks, setStudentMarks] = useState<CreateStudentGradesDetailModel[]>([]);

  const uniqueSubjectList = useMemo(() => {
    return getUniqueSubjects(classDetail?.subject_schedules || []);
  }, [classDetail?.subject_schedules])

  const openModal = (subject: UniqueSubject, student: StudentModel, studentMark: StudentGradesEntryModel | null) => {
    setEditData({
      ...studentMark,
      student_id: student.id,
      student_name: student.full_name,
      student_nis: student.nis || "",
      subject_name: subject.subject,
      subject_id: subject.subject_id,
    })
    setIsModalOpen(true);
  }

  const handleSaveModal = (data: StudentGradesEntryModel, subject_id: number) => {
    if (!editData) return;
    const student = studentMarks.find(studentMark => studentMark.subject_id === subject_id)?.students?.find(student => student.student_id === data.student_id);
    if (!student) {
      setStudentMarks(prev => {
        const existingDetail = prev.find(detail => detail.subject_id === subject_id);
        if (existingDetail) {
          return prev.map(detail => 
            detail.subject_id === subject_id ? { ...detail, students: [...(detail.students || []), { ...data, student_id: editData.student_id }] } : detail
          );
        } else return [...prev, { subject_id, students: [{ ...data, student_id: editData.student_id }] }];
      });
    } else {
      setStudentMarks(prev => prev.map(detail => 
        detail.subject_id === subject_id ? { 
          ...detail, 
          students: detail.students?.map(student => 
            student.student_id === data.student_id ? { ...student, ...data } : student
          ) 
        } : detail
      ));
    }
  }

  const getStudentMark = (subjectId: number, studentId: number) => {
    const subjectDetail = studentMarks.find(detail => detail.subject_id === subjectId);
    return subjectDetail?.students?.find(student => student.student_id === studentId) || null;
  }

  const handleBack = () => {
    dispatch(changeActiveMenu(""));
  };

  useEffect(() => {
    console.log("Student Marks Updated:", studentMarks);
  }, [studentMarks])

  return (
    <div>
      <ClassMarksModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editData={editData}
        handleSaveModal={handleSaveModal}
      />
      <div className="flex justify-between">
        <div>
          <p className="text-xl font-medium">Data Nilai Siswa</p>
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
            </tbody>
          </table>
        </div>
        <div className="flex gap-5">
          <Button>Import</Button>
          <Button variant="outline" onClick={handleBack}>Batal</Button>
        </div>
      </div>

      <div className="overflow-x-auto w-full">
        <table className="mt-5 w-full min-w-max font-medium text-sm">
          <tbody>
            <tr>
              <td className="border border-gray-400 px-3 py-2">No</td>
              <td className="border border-gray-400 px-3 py-2">NIS</td>
              <td className="border border-gray-400 px-3 py-2">Nama Lengkap</td>
              <td className="border border-gray-400 px-3 py-2">Nilai</td>
              {uniqueSubjectList.map((subject) => (
                <React.Fragment key={subject.subject_id}>
                  <td className="border border-gray-400 px-3 py-2 min-w-[140px]">{subject.subject}</td>
                  <td className="border border-gray-400 px-3 py-2">Aksi</td>
                </React.Fragment>
              ))}
            </tr>
            
            {classDetail?.students?.map((student, studentIdx) => (
              <React.Fragment key={student.id}>
                <tr>
                  <td rowSpan={6} className="border border-gray-400 px-3 py-2">{studentIdx + 1}</td>
                  <td rowSpan={6} className="border border-gray-400 px-3 py-2">{student.nis || "-"}</td>
                  <td rowSpan={6} className="border border-gray-400 px-3 py-2">{student.full_name}</td>
                </tr>
                <tr>
                  <td className="border border-gray-400 px-3 py-2">Tugas</td>
                  {uniqueSubjectList.map((subject) => {
                    const studentMark = getStudentMark(subject?.subject_id || 0, student?.id || 0);
                    return (
                      <React.Fragment key={subject.subject_id}>
                        <td className="border border-gray-400 px-3 py-2 max-w-[140px] overflow-hidden text-ellipsis">
                          {studentMark?.quiz}
                        </td>
                        <td rowSpan={6} className="border border-gray-400 px-3 py-2">
                          <FiEdit onClick={() => openModal(subject, student, studentMark)} className="mx-auto cursor-pointer size-5" />
                        </td>
                      </React.Fragment>
                    )
                  })}
                </tr>
                <tr>
                  <td className="border border-gray-400 px-3 py-2">Ujian Bulanan 1</td>
                  {uniqueSubjectList.map((subject) => (
                    <td key={subject.subject_id} className="border border-gray-400 px-3 py-2 max-w-[140px] overflow-hidden text-ellipsis">
                      {getStudentMark(subject?.subject_id || 0, student?.id || 0)?.first_month}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="border border-gray-400 px-3 py-2">Ujian Bulanan 2</td>
                  {uniqueSubjectList.map((subject) => (
                    <td key={subject.subject_id} className="border border-gray-400 px-3 py-2 max-w-[140px] overflow-hidden text-ellipsis">
                      {getStudentMark(subject?.subject_id || 0, student?.id || 0)?.second_month}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="border border-gray-400 px-3 py-2">Ujian Akhir</td>
                  {uniqueSubjectList.map((subject) => (
                    <td key={subject.subject_id} className="border border-gray-400 px-3 py-2 max-w-[140px] overflow-hidden text-ellipsis">
                      {getStudentMark(subject?.subject_id || 0, student?.id || 0)?.finals}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="border border-gray-400 px-3 py-2">Deskripsi</td>
                  {uniqueSubjectList.map((subject) => (
                    <td key={subject.subject_id} className="border border-gray-400 px-3 py-2 max-w-[140px] overflow-hidden text-ellipsis">
                      {getStudentMark(subject?.subject_id || 0, student?.id || 0)?.remarks}
                    </td>
                  ))}
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ClassMarks;
