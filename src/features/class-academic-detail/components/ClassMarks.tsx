import { useDispatch, useSelector } from "react-redux";
import Button from "../../../components/Button";
import { changeActiveMenu } from "../classAcademicSlice";
import { FiEdit } from "react-icons/fi";
import React, { useEffect, useMemo, useRef, useState } from "react";
import ClassMarksModal, { ClassMarksModalEditData } from "./ClassMarksModal";
import { RootState } from "../../../store";
import { getUniqueSubjects, markTypes } from "../helpers/unique-subject";
import { UniqueSubject, UpdateAcademicStudentNoteModel } from "../../../api-hooks/class/models/ClassModel";
import { StudentModel } from "../../../api-hooks/students/models/StudentModel";
import { StudentGradesDetailModel, StudentGradesEntryModel } from "../../../api-hooks/student-grades/models/StudentGradesModel";
import { useCreateStudentGrades, useGetStudentGrades, useUpdateStudentGrades } from "../../../api-hooks/student-grades/api";
import { useParams } from "react-router-dom";
import { useAlert } from "../../../contexts/AlertContext";
import { useQueryClient } from "@tanstack/react-query";
import { downloadStudentMarksExcel, handleImportStudentMarks } from "../helpers/student-marks.excel";
import { useGetTeacherByToken } from "../../../api-hooks/teacher/api";
import { useAuth } from "../../../hooks/useAuth";
import { usePermissionAccess } from "../../../hooks/useAccessRight";
import ClassMarksNoteModal from "./ClassMarksNoteModal";
import { useUpdateAcademicStudentNote } from "../../../api-hooks/class/api";

interface ClassMarksProps {
  termId: number;
  setTermId: React.Dispatch<React.SetStateAction<number>>;
}

function ClassMarks({ setTermId, termId }: ClassMarksProps) {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const { showAlert } = useAlert();
  const { getUser } = useAuth();
  const { data: studentGradesData } = useGetStudentGrades(parseInt(id || "0"), termId);
  const { data: loggedInTeacher } = useGetTeacherByToken();
  const { getPermissionAccess } = usePermissionAccess();
  
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const { classDetail } = useSelector((state: RootState) => state.classAcademic);
  const [editData, setEditData] = useState<ClassMarksModalEditData | null>(null);
  const [editStudentNoteData, setEditStudentNoteData] = useState<UpdateAcademicStudentNoteModel | null>(null);
  const [studentMarks, setStudentMarks] = useState<StudentGradesDetailModel[]>([]);
  const [studentNotes, setStudentNotes] = useState<UpdateAcademicStudentNoteModel[]>([]);
  const isFirstTerm = useMemo(() => classDetail?.terms?.find(term => term.id === termId)?.name === "Semester 1", [classDetail?.terms, termId]);

  const uniqueSubjectList = useMemo(() => {
    const uniqueSubject = getUniqueSubjects(classDetail?.subject_schedules || []);
    if (!loggedInTeacher?.data?.id) return uniqueSubject;
    if (!getPermissionAccess("academic_all_score").write) {
      return uniqueSubject.filter(subject => subject?.teacher_id === loggedInTeacher?.data?.id);
    }
    return uniqueSubject;
  }, [classDetail?.subject_schedules, getUser, loggedInTeacher?.data?.id])

  const openModal = (subject: UniqueSubject, student: StudentModel, studentMark?: StudentGradesEntryModel | null) => {
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

  const openNoteModal = (student: StudentModel) => {
    const studentNote = studentNotes.find(note => note.student_id === student.id);
    setEditStudentNoteData({
      id: studentNote?.id || 0,
      academic_id: parseInt(id || "0"),
      student_name: student?.full_name,
      student_id: student?.id || 0,
      first_term_notes: studentNote?.first_term_notes || "",
      second_term_notes: studentNote?.second_term_notes || "",
    })
    setIsNoteModalOpen(true);
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

  const handleSaveNoteModal = async (data: UpdateAcademicStudentNoteModel) => {
    setStudentNotes(prev => {
      const existingNote = prev.find(note => note.student_id === data.student_id);
      if (existingNote) {
        return prev.map(note => 
          note.student_id === data.student_id ? { ...note, ...data } : note
        );
      } else {
        return [...prev, data];
      }
    });
  }

  const handleDownload = () => {
    const data: StudentGradesDetailModel[] = uniqueSubjectList?.map(subject => ({
      ...subject,
      subject_name: subject.subject,
      students: classDetail?.students?.map(student => {
        const studentMark = getStudentMark(subject.subject_id || 0, student.id || 0);
        return {
          student_id: student.id,
          nis: student.nis || "",
          student_name: student.full_name,
          first_quiz: studentMark?.first_quiz || "",
          first_month: studentMark?.first_month || "",
          second_quiz: studentMark?.second_quiz || "",
          second_month: studentMark?.second_month || "",
          finals: studentMark?.finals || "",
          remarks: studentMark?.remarks || "",
        }
      }) as StudentGradesEntryModel[],
    }));
    downloadStudentMarksExcel(data, studentNotes, isFirstTerm);
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;
    const data: StudentGradesDetailModel[] = uniqueSubjectList?.map(subject => ({
      ...subject,
      subject_name: subject.subject,
      students: classDetail?.students?.map(student => {
        const studentMark = getStudentMark(subject.subject_id || 0, student.id || 0);
        return {
          id: studentMark?.id || 0,
          student_id: student.id,
          nis: student.nis || "",
          student_name: student.full_name,
          first_quiz: studentMark?.first_quiz || "",
          first_month: studentMark?.first_month || "",
          second_quiz: studentMark?.second_quiz || "",
          second_month: studentMark?.second_month || "",
          finals: studentMark?.finals || "",
        }
      }) as StudentGradesEntryModel[],
    }));
    inputFileRef.current!.value = "";
    const result = await handleImportStudentMarks(selectedFile, data, studentNotes, isFirstTerm);
    setStudentMarks(result.studentGrades);
  }

  const getStudentMark = (subjectId: number, studentId: number) => {
    const subjectDetail = studentMarks?.find(detail => detail.subject_id === subjectId);
    return subjectDetail?.students?.find(student => student.student_id === studentId) || null;
  }

  const { mutateAsync: mutateCreate } = useCreateStudentGrades();
  const { mutateAsync: mutateUpdate } = useUpdateStudentGrades();
  const { mutateAsync: mutateUpdateStudent } = useUpdateAcademicStudentNote();

  const handleSubmit = async () => {
    const mutate = studentGradesData?.data.details?.length ? mutateUpdate : mutateCreate;
    if (!studentMarks.length) {
      showAlert({
        title: "Peringatan",
        type: "warning",
        message: "Nilai siswa tidak boleh kosong.",
      });
      return;
    }
    const response = await mutate({
      academic_id: id ? parseInt(id) : 0,
      term_id: termId,
      details: studentMarks,
    });

    const responseNote = await mutateUpdateStudent(studentNotes.map(note => ({ ...note, is_first_term: isFirstTerm })));
    
    if (response.status === 200 && responseNote.status === 200) {
      showAlert({
        title: "Berhasil",
        type: "success",
        message: "Data nilai siswa berhasil disimpan.",
      });
      queryClient.invalidateQueries({
        queryKey: ["student-grades", id],
      });
    } else {
      showAlert({
        title: "Gagal",
        type: "error",
        message: response.error || "Terjadi kesalahan saat menyimpan data nilai siswa.",
      });
    }
  }

  const handleBack = () => {
    dispatch(changeActiveMenu(""));
  };

  useEffect(() => {
    if (!studentGradesData?.data) return;
    setStudentMarks(studentGradesData.data.details || []);
    const studentNotes: UpdateAcademicStudentNoteModel[] = [];
    studentGradesData?.data?.teacher_notes?.forEach(teacherNote => {
      studentNotes.push({
        id: teacherNote.id || 0,
        academic_id: studentGradesData.data.academic_id,
        student_id: teacherNote.student_id || 0,
        student_name: teacherNote.student,
        first_term_notes: isFirstTerm ? teacherNote.notes : "",
        second_term_notes: isFirstTerm ? "" : teacherNote.notes,
      })
    })
    setStudentNotes(studentNotes);
  }, [studentGradesData?.data]);

  return (
    <div>
      <ClassMarksModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editData={editData}
        handleSaveModal={handleSaveModal}
      />
      <ClassMarksNoteModal 
        isOpen={isNoteModalOpen}
        onClose={() => setIsNoteModalOpen(false)}
        editData={editStudentNoteData}
        handleSaveNoteModal={handleSaveNoteModal}
        isFirstTerm={isFirstTerm}
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
            
            {classDetail?.students?.map((student, studentIdx) => {
              const studentMarksBySubject = uniqueSubjectList.reduce<Record<number, StudentGradesEntryModel | null | undefined>>((acc, subject) => {
                acc[subject.subject_id] = getStudentMark(subject.subject_id || 0, student.id || 0);
                return acc;
              }, {});

              return (
                <React.Fragment key={student.id}>
                  {markTypes.map((markType, markIdx) => (
                    <tr key={`${student.id}-${markType.dataKey}`}>
                      {markIdx === 0 && (
                        <>
                          <td rowSpan={markTypes.length + 1} className="border border-gray-400 px-3 py-2 align-top">
                            {studentIdx + 1}
                          </td>
                          <td rowSpan={markTypes.length + 1} className="border border-gray-400 px-3 py-2 align-top">
                            {student.nis || "-"}
                          </td>
                          <td rowSpan={markTypes.length + 1} className="border border-gray-400 px-3 py-2 align-top">
                            {student.full_name}
                          </td>
                        </>
                      )}
                      <td className="border border-gray-400 px-3 py-2">{markType.label}</td>
                      
                      {uniqueSubjectList.map((subject) => {
                        const currentStudentMark = studentMarksBySubject[subject.subject_id];
                        return (
                          <React.Fragment key={`${student.id}-${subject.subject_id}-${markType.dataKey}-details`}>
                            <td className="border border-gray-400 px-3 py-2 max-w-[140px] overflow-hidden whitespace-nowrap text-ellipsis">
                              {currentStudentMark?.[markType.dataKey] || ""}
                            </td>
                            {markIdx === 0 && (
                              <td rowSpan={markTypes.length} className="border border-gray-400 px-3 py-2 align-middle text-center">
                                <button 
                                  type="button"
                                  onClick={() => openModal(subject, student, currentStudentMark)} 
                                  className="p-1 hover:bg-gray-200 rounded cursor-pointer"
                                  aria-label={`Edit marks for ${student.full_name} in ${subject.subject}`}
                                >
                                  <FiEdit className="size-5" />
                                </button>
                              </td>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </tr>
                  ))}
                  {getPermissionAccess("academic_all_score").write ? (
                    <tr>
                      <td className="border border-gray-400 px-3 py-2 align-top">
                        <div className="flex gap-2 items-center">
                          <p>Catatan Wali Kelas</p>
                          <FiEdit onClick={() => openNoteModal(student)} className="cursor-pointer size-4" />
                        </div>
                      </td>
                      <td colSpan={uniqueSubjectList.length * 2} className="border border-gray-400 px-3 py-2 align-top overflow-hidden">
                        {isFirstTerm ? studentNotes.find(note => note.student_id === student.id)?.first_term_notes 
                        : studentNotes.find(note => note.student_id === student.id)?.second_term_notes || ""}
                      </td>
                    </tr>
                  ) : <tr></tr>}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ClassMarks;
