import { StudentGradeReportModel } from '../../../api-hooks/student-grades/models/StudentGradesModel';

interface ExamRecapTableProps {
  examRecapData?: StudentGradeReportModel
}

function ExamRecapTable({ examRecapData }: ExamRecapTableProps) {
  return (
    <div>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th colSpan={5} className="border px-4 py-2 text-center font-bold">
              {examRecapData?.class} <span className='mx-5'>|</span> Average Nilai = {examRecapData?.average}
            </th>
          </tr>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">Peringkat</th>
            <th className="border px-4 py-2 text-left">NIS</th>
            <th className="border px-4 py-2 text-left">Nama Siswa</th>
            <th className="border px-4 py-2 text-left">Kelas</th>
            <th className="border px-4 py-2">Nilai</th>
          </tr>
        </thead>
        <tbody>
          {examRecapData?.students.map((student, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="border px-4 py-2 text-center">{student.rank}</td>
              <td className="border px-4 py-2">{student.nis}</td>
              <td className="border px-4 py-2">{student.student}</td>
              <td className="border px-4 py-2">{student.class}</td>
              <td className="border px-4 py-2 text-center">{student.finals}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ExamRecapTable;
