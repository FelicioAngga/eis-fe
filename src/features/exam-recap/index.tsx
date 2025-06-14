import { useMemo, useState } from "react";
import { useGetExamRecap } from "../../api-hooks/student-grades/api";
import { YearPicker } from "../../components/YearPicker";
import { useGradeQuery } from "../../api-hooks/grade/api";
import { useClassQuery } from "../../api-hooks/class/api";
import ExamRecapTable from "./components/ExamRecapTable";

export default function ExamRecap() {
  const [startYear, setStartYear] = useState<string>(new Date().getFullYear().toString());
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [selectedAcademicId, setSelectedAcademicId] = useState<number | null>(null);
  const [termId, setTermId] = useState<number>(0);
  const { data: gradeData } = useGradeQuery({ pagination: { limit: 99999 }, search: ""});
  const { data: academicData } = useClassQuery({ pagination: { limit: 99999 }, search: "" });
  const { data: examRecapData } = useGetExamRecap({
    academic_id: selectedAcademicId || 0,
    level_id: selectedGrade || 0,
    academic_year: `${startYear}/${+startYear + 1}`,
    term_id: termId,
  });
  const selectedAcademic = useMemo(() => {
    return academicData?.data.find(academic => academic.id === selectedAcademicId);
  }, [selectedAcademicId, academicData])

  return (
    <div>
      <p className="text-2xl font-medium">Laporan Ujian Siswa</p>
      <div className="mt-6 flex gap-3">
        <YearPicker
          name="start_year"
          label="Tahun Ajaran Mulai"
          value={startYear}
          onChange={(year) => setStartYear(year)}
          
        />
        <div className="w-full font-medium text-sm flex flex-col gap-4">
          <p>Tahun Ajaran Selesai</p>
          <p>{startYear ? +startYear + 1 : "-"}</p>
        </div>

        <div className="relative w-full pr-3">
          <p className="font-medium mb-2 text-sm">Jenjang</p>
          <select 
            value={selectedGrade || ""}
            onChange={(e) => setSelectedGrade(Number(e.target.value))} 
            className="w-full border border-gray-300 appearance-none rounded-md px-3 py-2.5 cursor-pointer"
          >
            <option value="">Pilih Jenjang</option>
            {gradeData?.data.map(grade => (<option value={grade.id} key={grade.id}>{grade.name}</option>))}
          </select>
          <div className="absolute top-11 right-5 flex items-center px-2 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>

        <div className="relative w-full pr-3">
          <p className="font-medium mb-2 text-sm">Akademik</p>
          <select 
            value={selectedAcademicId || ""}
            onChange={(e) => setSelectedAcademicId(Number(e.target.value))} 
            className="w-full border border-gray-300 appearance-none rounded-md px-3 py-2.5 cursor-pointer"
          >
            <option value="">Pilih Akademik</option>
            {academicData?.data.map(academic => (<option value={academic.id} key={academic.id}>{academic.display_name}</option>))}
          </select>
          <div className="absolute top-11 right-5 flex items-center px-2 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>

        <div className="relative w-full pr-3">
          <p className="font-medium mb-2 text-sm">Semester</p>
          <select 
            value={termId || ""}
            onChange={(e) => setTermId(Number(e.target.value))} 
            className="w-full border border-gray-300 appearance-none rounded-md px-3 py-2.5 cursor-pointer"
          >
            <option value="">{selectedAcademicId ? "Pilih Semester" : "Pilih Akademik Dulu"}</option>
            {selectedAcademic?.terms.map(term => (<option value={term.id} key={term.id}>{term.name}</option>))}
          </select>
          <div className="absolute top-11 right-5 flex items-center px-2 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap justify-between">
        {examRecapData?.data?.map((recap, idx) => <ExamRecapTable examRecapData={recap} key={idx} />)}
      </div>
    </div>
  )
}