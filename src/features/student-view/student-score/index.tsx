import React from "react";
import { useGetStudentGradeByToken } from "../../../api-hooks/student-grades/api"
import { useDetailStudentByToken } from "../../../api-hooks/students/api";


function StudentViewScore() {
  const { data: studentScore } = useGetStudentGradeByToken();
  const { data: studentData } = useDetailStudentByToken();
  return (
    <div>
      <p className="text-xl font-medium">Data Nilai Siswa</p>
      <table className="mt-5 font-medium text-sm">
        <tbody>
          <tr>
            <td className="pr-6 pb-1">Nama</td>
            <td className="pr-6 pb-1">:</td>
            <td className="pr-6 pb-1">{studentData?.data.full_name}</td>
          </tr>
          <tr>
            <td className="pr-6 pb-1">Jurusan</td>
            <td className="pr-6 pb-1">:</td>
            <td className="pr-6 pb-1">{studentData?.data.academics?.major}</td>
          </tr>
          <tr>
            <td className="pr-6 pb-1">Kelas</td>
            <td className="pr-6 pb-1">:</td>
            <td className="pr-6 pb-1">{studentData?.data.academics?.classroom?.display_name}</td>
          </tr>
          <tr>
            <td className="pr-6 pb-1">Wali Kelas</td>
            <td className="pr-6 pb-1">:</td>
            <td className="pr-6 pb-1">{(studentData?.data.academics?.homeroom_teacher as any)?.name}</td>
          </tr>
        </tbody>
      </table>

      <table className="border w-full mt-5">
        <tbody>
          <tr className="border border-gray-500">
            <td className="border border-gray-500 px-3 py-1.5 text-center">No</td>
            <td className="border border-gray-500 px-3 py-1.5">Mata Pelajaran</td>
            <td className="border border-gray-500 px-3 py-1.5">Pembagian Nilai</td>
            <td className="border border-gray-500 px-3 py-1.5 text-center">Nilai</td>
          </tr>
          {studentScore?.data.map((score, idx) => (
            <React.Fragment key={idx}>
              <tr>
                <td rowSpan={4} className="border border-gray-500 text-center px-3 py-1.5">{idx + 1}</td>
                <td className="border border-gray-500 px-3 py-1.5" rowSpan={4}>{score.subject_name}</td>
                <td className="border border-gray-500 px-3 py-1.5">Tugas</td>
                <td className="border border-gray-500 px-3 py-1.5 text-center">{score.quiz}</td>
              </tr>
              <tr>
                <td className="border border-gray-500 px-3 py-1.5">Bulanan 1</td>
                <td className="border border-gray-500 text-center px-3 py-1.5">{score.first_month}</td>
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