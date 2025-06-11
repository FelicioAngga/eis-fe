import { useState } from "react";
import { useGetTeacherAbsenceReport } from "../../api-hooks/teacher-absence/api"
import FilterTable from "./components/FilterTable";

export default function() {
  const [search, setSearch] = useState({ name: "", startDate: "", endDate: "" });
  const { data: teacherReportData } = useGetTeacherAbsenceReport({ 
    search: search.name,
    start_date: search.startDate,
    end_date: search.endDate
  });

  const handleSearch = (data: {name: string, startDate: string, endDate: string}) => {
    setSearch({
      name: data.name,
      startDate: data.startDate,
      endDate: data.endDate
    });
  }

  return (
    <div>
      <FilterTable onSearch={handleSearch} />
      <div className="mt-6">
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 px-1.5 py-2 text-left">Nama Guru</th>
                <th className="border border-gray-300 px-1.5 py-2">Jumlah Kehadiran</th>
                <th className="border border-gray-300 px-1.5 py-2">Jumlah Telat</th>
                <th className="border border-gray-300 px-1.5 py-2">Jumlah Pulang Cepat</th>
                <th className="border border-gray-300 px-1.5 py-2">Jumlah Absen</th>
                <th className="border border-gray-300 px-1.5 py-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {teacherReportData?.data.map((entry, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 px-1.5 py-2">{entry.teacher}</td>
                  <td className="border border-gray-300 px-1.5 py-2">{entry.present}</td>
                  <td className="border border-gray-300 px-1.5 py-2">{entry.late}</td>
                  <td className="border border-gray-300 px-1.5 py-2">{entry.early_leave}</td>
                  <td className="border border-gray-300 px-1.5 py-2">{entry.absence}</td>
                  <td className="border border-gray-300 px-1.5 py-2">{entry.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}