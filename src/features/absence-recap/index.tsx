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
    status: "",
  });

  const { data: studentAbsenceReport } = useGetStudentAbsenceReport({
    search: search.name,
    start_date: search.startDate,
    end_date: search.endDate,
    level_id: search.level_id,
    academic_id: search.academic_id,
    term_id: search.term_id,
    status: translatePermissionStatus(search.status),
  });

  function handleSearch(data: {
    name: string;
    startDate: string;
    endDate: string;
    level_id?: string;
    academic_id?: string;
    term_id?: string;
    status?: string;
  }) {
    setSearch({
      name: data.name,
      startDate: data.startDate,
      endDate: data.endDate,
      level_id: data.level_id || "",
      academic_id: data.academic_id || "",
      term_id: data.term_id || "",
      status: data.status || "",
    });
  }

  return (
    <div>
      <FilterTable onSearch={handleSearch} />
      <div className={`mt-6 flex ${(studentAbsenceReport?.data?.levels?.length || 0) > 0 && "gap-4"}`}>
        {!search.startDate || !search.endDate ? (
          <div>
            <p className="text-gray-600">Silakan pilih tanggal mulai dan selesai untuk melihat rekap.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto shrink-0 min-w-[180px]">
              {studentAbsenceReport?.data?.levels?.map((level, index) => (
                <table key={index} className="w-full table-auto border-collapse border border-gray-300">
                  <thead>
                    <tr>
                      <th colSpan={search.status == "" ? 4 : 1} className="border border-gray-300 px-1.5 py-2 text-center">{level.level}</th>
                    </tr>
                    <tr>
                      {(search.status === "" || search.status === "Hadir") && <th className="border border-gray-300 px-1.5 py-2">Hadir</th>}
                      {(search.status === "Sakit" || search.status == "") && <th className="border border-gray-300 px-1.5 py-2">Sakit</th>}
                      {(search.status === "Izin" || search.status == "") && <th className="border border-gray-300 px-1.5 py-2">Izin</th>}
                      {(search.status === "Alpha" || search.status == "") && <th className="border border-gray-300 px-1.5 py-2">Alpha</th>}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      {(search.status === "" || search.status === "Hadir") && <td className="border text-center border-gray-300 px-1.5 py-2">{level.present_count}</td>}
                      {(search.status === "Sakit" || search.status == "") && <td className="border text-center border-gray-300 px-1.5 py-2">{level.sick_count}</td>}
                      {(search.status === "Izin" || search.status == "") && <td className="border text-center border-gray-300 px-1.5 py-2">{level.permission_count}</td>}
                      {(search.status === "Alpha" || search.status == "") && <td className="border text-center border-gray-300 px-1.5 py-2">{level.alpha_count}</td>}
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
                    {(search.status === "" || search.status === "Hadir") && <th className="border border-gray-300 px-1.5 py-2">Hadir</th>}
                    {(search.status === "Sakit" || search.status == "") && <th className="border border-gray-300 px-1.5 py-2">Sakit</th>}
                    {(search.status === "Izin" || search.status == "") && <th className="border border-gray-300 px-1.5 py-2">Izin</th>}
                    {(search.status === "Alpha" || search.status == "") && <th className="border border-gray-300 px-1.5 py-2">Alpha</th>}
                  </tr>
                </thead>
                <tbody>
                  {studentAbsenceReport?.data?.entries?.map((entry, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 px-1.5 py-2">{entry.student}</td>
                      {(search.status === "" || search.status === "Hadir") && <td className="border text-center border-gray-300 px-1.5 py-2">{entry.present_count}</td>}
                      {(search.status === "Sakit" || search.status == "") && <td className="border text-center border-gray-300 px-1.5 py-2">{entry.sick_count}</td>}
                      {(search.status === "Izin" || search.status == "") && <td className="border text-center border-gray-300 px-1.5 py-2">{entry.permission_count}</td>}
                      {(search.status === "Alpha" || search.status == "") && <td className="border text-center border-gray-300 px-1.5 py-2">{entry.alpha_count}</td>}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export const translatePermissionStatus = (status: string) => {
  switch (status) {
    case "Hadir":
      return "Present";
    case "Sakit":
      return "Sick";
    case "Izin":
      return "Permission";
    case "Alpha":
      return "Alpha";
    default:
      return status;
  }
}