import Button from "../../../components/Button";
import letjenLogo from "../../../assets/images/letjen-logo.png"
import { BiChevronLeft } from "react-icons/bi";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { useGetStudentGrades } from "../../../api-hooks/student-grades/api";
import { useClassDetail } from "../../../api-hooks/class/api";
import { getUniqueSubjects } from "../helpers/unique-subject";
import { useDetailStudentQuery } from "../../../api-hooks/students/api";

function PrintStudentReport() {
  const { student_id, academic_id, term_id } = useParams();
  const navigate = useNavigate();
  const { data: studentGrade, isFetched: isStudentGradeFetched } = useGetStudentGrades(academic_id ? parseInt(academic_id) : 0, term_id ? parseInt(term_id) : 0);
  const { data: classDetail, isFetched: isClassDetailFetched } = useClassDetail(academic_id ? parseInt(academic_id) : 0);
  const { data: studentData, isFetched: isStudentFetched } = useDetailStudentQuery(parseInt(student_id || "0"));

  const uniqueSubjectList = useMemo(() => {
    return getUniqueSubjects(classDetail?.data?.subject_schedules || []);
  }, [classDetail?.data?.subject_schedules])
  const allFetched = isClassDetailFetched && isStudentGradeFetched && isStudentFetched && uniqueSubjectList.length > 0;

  const getFinalScoreBySubject = (subjectId: number) => {
    const subject = studentGrade?.data?.details?.find((s) => s.subject_id === subjectId);
    const student = subject?.students?.find(student => student?.student_id === parseInt(student_id || "0"));
    if (!student) {
      setTimeout(() => {
        window.print();
      }, 100)
      return { score: 0, remarks: "-" };
    }
    if (allFetched && subjectId === studentGrade?.data?.details[studentGrade?.data?.details?.length - 1]?.subject_id) {
      setTimeout(() => {
        window.print();
      }, 100)
    }

    return {
      score: student?.final_grade || 0,
      remarks: student?.remarks || "-"
    }
  }
  
  useEffect(() => {
    if (!isClassDetailFetched || !isStudentGradeFetched || !isStudentFetched || uniqueSubjectList.length == 0) return;
    const handleAfterPrint = () => {
      window.close();
    };
    window.addEventListener("afterprint", handleAfterPrint);
    return () => {
      window.removeEventListener("afterprint", handleAfterPrint);
    };
  }, [isClassDetailFetched, isStudentGradeFetched, isStudentFetched, uniqueSubjectList.length]);

  return (
    <div>
      <div
        onClick={() => navigate(`/academic/detail/${academic_id}`)}
        className="print:hidden mb-2 transition-all duration-[400ms] flex items-center gap-1 hover:gap-3 text-primary cursor-pointer"
      >
        <BiChevronLeft className="text-2xl" />
        <p className="font-semibold text-sm">Kembali</p>
      </div>
      <div className="flex justify-between items-center mb-5 print:hidden">
        <p className="font-semibold text-lg">Rapor Print Preview</p>
        <Button className="w-24" onClick={() => window.print()}>Cetak</Button>
      </div>

      <p className="text-2xl font-medium mb-4 text-center">Laporan Hasil Belajar</p>
      <div className="flex justify-between">
        <div className="flex gap-5">
          <img src={letjenLogo} className="object-cover size-32" />
          <table className="h-fit font-medium">
            <tbody>
              <tr>
                <td className="pr-5">Nama</td>
                <td className="pr-5">:</td>
                <td className="pr-5">{studentData?.data?.full_name}</td>
              </tr>
              <tr>
                <td className="pr-5">NIS/NISN</td>
                <td className="pr-5">:</td>
                <td className="pr-5">{studentData?.data?.nis}/{studentData?.data?.nisn}</td>
              </tr>
              <tr>
                <td className="pr-5">Kelas</td>
                <td className="pr-5">:</td>
                <td className="pr-5">{classDetail?.data?.classroom}</td>
              </tr>
              <tr>
                <td className="pr-5">Jurusan</td>
                <td className="pr-5">:</td>
                <td className="pr-5">{classDetail?.data?.major}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <table className="mt-5">
        <thead>
          <tr className="font-medium">
            <th className="border border-gray-400 px-3 py-4">No</th>
            <th className="text-left border border-gray-400 px-3 py-4 w-2/12">Mata Pelajaran</th>
            <th className="border border-gray-400 px-3 py-4 w-2/12">Nilai Akhir</th>
            <th className="text-left border border-gray-400 px-3 py-4 w-full">Deskripsi</th>
          </tr>
        </thead>
        <tbody>
          {uniqueSubjectList?.map((subject, idx) => (
            <tr key={idx}>
              <td className="border border-gray-400 px-3 py-4 text-center font-medium">{idx + 1}</td>
              <td className="border border-gray-400 px-3 py-4">{subject?.subject}</td>
              <td className="text-center border border-gray-400 px-3 py-4">{getFinalScoreBySubject(subject?.subject_id)?.score}</td>
              <td className="border border-gray-400 px-3 py-4">{getFinalScoreBySubject(subject.subject_id).remarks}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default PrintStudentReport;
