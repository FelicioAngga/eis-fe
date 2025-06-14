import React, { useEffect, useState } from "react";
import { useGetAcademicsByStudent, useGetStudentGradeByToken } from "../../../api-hooks/student-grades/api"
import { useDetailStudentByToken } from "../../../api-hooks/students/api";
import { StudentAcademicModel } from "../../../api-hooks/student-grades/models/StudentGradesModel";


function StudentViewScore() {
  const [termId, setTermId] = useState(0);
  const [currentAcademic, setCurrentAcademic] = useState<StudentAcademicModel | null>(null);
  const { data: studentData } = useDetailStudentByToken();
  const { data: academicsData } = useGetAcademicsByStudent();
  const { data: studentScore } = useGetStudentGradeByToken((currentAcademic?.id || 0), termId);

  const handleCurrentAcademicChange = (academicId: number) => {
    const academic = academicsData?.data.find(academic => academic.id === academicId);
    if (academic) {
      setCurrentAcademic(academic);
      setTermId(academic.terms[0]?.id || 0);
    }
  }

  useEffect(() => {
    if (!academicsData?.data || !studentData?.data) return;
    const currentAcademicData = academicsData?.data.find(academic => academic?.id === studentData?.data?.current_academic_id);
    if (currentAcademicData) {
      setCurrentAcademic(currentAcademicData);
      setTermId(currentAcademicData.terms[0]?.id || 0);
    }
  }, [academicsData, studentData]);

  return (
    <div>
      <p className="text-xl font-medium">Data Nilai Siswa</p>
      <table className="mt-5 font-medium text-sm min-w-[50%]">
        <tbody>
          <tr>
            <td className="pr-6 pb-2">Nama</td>
            <td className="pr-6 pb-2">:</td>
            <td className="pr-6 pb-2">{studentData?.data.full_name}</td>
          </tr>
          <tr>
            <td className="pr-6 pb-2">Jurusan</td>
            <td className="pr-6 pb-2">:</td>
            <td className="pr-6 pb-2">{studentData?.data.academics?.major}</td>
          </tr>
          <tr>
            <td className="pr-6 pb-2">Kelas Akademik</td>
            <td className="pr-6 pb-2">:</td>
            <td className="pr-6 pb-2">
              <div className="relative pr-3">
                <select
                  className="w-full border border-gray-300 appearance-none rounded-md px-3 py-2 cursor-pointer"
                  onChange={(e) => handleCurrentAcademicChange(parseInt(e.currentTarget.value))}
                  value={currentAcademic?.id}
                >
                  {academicsData?.data?.map(academic => 
                    <option value={academic.id} key={academic.id}>{academic?.display_name}</option>
                  )}
                </select>
                <div className="absolute inset-y-0 right-5 flex items-center px-2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td className="pr-6 pb-2">Semester</td>
            <td className="pr-6 pb-2">:</td>
            <td className="pr-6 pb-2">
              <div className="relative pr-3">
                <select
                  className="w-full border border-gray-300 appearance-none rounded-md px-3 py-2 cursor-pointer"
                  onChange={(e) => setTermId(parseInt(e.currentTarget.value))}
                  value={termId}
                >
                  {currentAcademic?.terms?.map(term => 
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
            <td className="pr-6 pb-2">Wali Kelas</td>
            <td className="pr-6 pb-2">:</td>
            <td className="pr-6 pb-2">{(studentData?.data.academics?.homeroom_teacher as any)?.name}</td>
          </tr>
        </tbody>
      </table>

      <table className="border w-full mt-5 font-medium">
        <tbody>
          <tr className="border bg-gray-100 border-gray-500">
            <td className="border border-gray-500 px-3 py-1.5 text-center">No</td>
            <td className="border border-gray-500 px-3 py-1.5">Mata Pelajaran</td>
            <td className="border border-gray-500 px-3 py-1.5">Pembagian Nilai</td>
            <td className="border border-gray-500 px-3 py-1.5 text-center">Nilai</td>
          </tr>
          {studentScore?.data?.map((score, idx) => (
            <React.Fragment key={idx}>
              <tr>
                <td rowSpan={5} className="border border-gray-500 text-center px-3 py-1.5">{idx + 1}</td>
                <td className="border border-gray-500 px-3 py-1.5" rowSpan={5}>{score.subject_name}</td>
                <td className="border border-gray-500 px-3 py-1.5">Tugas Bulanan 1</td>
                <td className="border border-gray-500 px-3 py-1.5 text-center">{score.first_quiz}</td>
              </tr>
              <tr>
                <td className="border border-gray-500 px-3 py-1.5">Bulanan 1</td>
                <td className="border border-gray-500 text-center px-3 py-1.5">{score.first_month}</td>
              </tr>
              <tr>
                <td className="border border-gray-500 px-3 py-1.5">Tugas Bulanan 2</td>
                <td className="border border-gray-500 text-center px-3 py-1.5">{score.second_quiz}</td>
              </tr>
              <tr>
                <td className="border border-gray-500 px-3 py-1.5">Bulanan 2</td>
                <td className="border border-gray-500 text-center px-3 py-1.5">{score.second_month}</td>
              </tr>
              <tr>
                <td className="border border-gray-500 px-3 py-1.5">UAS</td>
                <td className="border border-gray-500 text-center px-3 py-1.5">{score.finals}</td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default StudentViewScore