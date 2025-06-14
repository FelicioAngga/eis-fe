import { useState } from "react";
import { useGetStudentAbsenceReport } from "../../api-hooks/absence/api";
import FilterTable from "./components/FilterTable";

export default function () {
  const [search, setSearch] = useState({
    name: "",
    startDate: "",
    endDate: "",
    level_id: "",
    academic_id: "",
    term_id: "",
  });

  const { data: studentAbsenceReport } = useGetStudentAbsenceReport({
    search: search.name,
    start_date: search.startDate,
    end_date: search.endDate,
    level_id: search.level_id,
    academic_id: search.academic_id,
    term_id: search.term_id,
  });

  function handleSearch(data: {
    name: string;
    startDate: string;
    endDate: string;
    level_id?: string;
    academic_id?: string;
    term_id?: string;
  }) {
    setSearch({
      name: data.name,
      startDate: data.startDate,
      endDate: data.endDate,
      level_id: data.level_id || "",
      academic_id: data.academic_id || "",
      term_id: data.term_id || "",
    });
  }

  return (
    <div>
      <FilterTable onSearch={handleSearch} />

      <div className="mt-6 flex gap-4">
        <div className="overflow-x-auto shrink-0">
          {studentAbsenceReport?.data?.levels?.map((level, index) => (
            <table key={index} className="w-full table-auto border-collapse border border-gray-300">
              <thead>
                <tr>
                  <th colSpan={4} className="border border-gray-300 px-1.5 py-2 text-center">{level.level}</th>
                </tr>
                <tr>
                  <th className="border border-gray-300 px-1.5 py-2">Hadir</th>
                  <th className="border border-gray-300 px-1.5 py-2">Sakit</th>
                  <th className="border border-gray-300 px-1.5 py-2">Izin</th>
                  <th className="border border-gray-300 px-1.5 py-2">Alpha</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-1.5 py-2 text-center">{level.present_count}</td>
                  <td className="border border-gray-300 px-1.5 py-2 text-center">{level.sick_count}</td>
                  <td className="border border-gray-300 px-1.5 py-2 text-center">{level.permission_count}</td>
                  <td className="border border-gray-300 px-1.5 py-2 text-center">{level.alpha_count}</td>
                </tr>
              </tbody>
            </table>
          ))}
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 px-1.5 py-2 text-left">Nama Siswa</th>
                <th className="border border-gray-300 px-1.5 py-2">Kehadiran</th>
                <th className="border border-gray-300 px-1.5 py-2">Sakit</th>
                <th className="border border-gray-300 px-1.5 py-2">Izin</th>
                <th className="border border-gray-300 px-1.5 py-2">Alpha</th>
              </tr>
            </thead>
            <tbody>
              {studentAbsenceReport?.data?.entries?.map((entry, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 px-1.5 py-2">{entry.student}</td>
                  <td className="border border-gray-300 px-1.5 py-2 text-center">{entry.present_count}</td>
                  <td className="border border-gray-300 px-1.5 py-2 text-center">{entry.sick_count}</td>
                  <td className="border border-gray-300 px-1.5 py-2 text-center">{entry.permission_count}</td>
                  <td className="border border-gray-300 px-1.5 py-2 text-center">{entry.alpha_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
