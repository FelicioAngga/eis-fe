import { useState } from "react";
import { useGetStudentAbsenceByToken } from "../../../api-hooks/absence/api";
import { useDetailStudentByToken } from "../../../api-hooks/students/api";
import dayjs from "dayjs";

function StudentAbsence() {
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const { data: absenceData } = useGetStudentAbsenceByToken(selectedMonth);
  const { data: studentData } = useDetailStudentByToken();

  return (
    <div>
      <p className="font-semibold text-xl">Absensi Siswa</p>
      <table className="mt-4 font-medium text-sm">
        <tbody>
          <tr>
            <td className="pb-1.5 pr-5">Bulan</td>
            <td className="pb-1.5 pr-5">:</td>
            <td className="pb-1.5 pr-5">
              <select 
                value={selectedMonth} 
                onChange={(e) => setSelectedMonth(Number(e.target.value))} 
                className="w-full border border-gray-400 rounded-lg"
              >
                <option value="1">Januari</option>
                <option value="2">Februari</option>
                <option value="3">Maret</option>
                <option value="4">April</option>
                <option value="5">Mei</option>
                <option value="6">Juni</option>
                <option value="7">Juli</option>
                <option value="8">Agustus</option>
                <option value="9">September</option>
                <option value="10">Oktober</option>
                <option value="11">November</option>
                <option value="12">Desember</option>
              </select>
            </td>
          </tr>
          <tr>
            <td className="pb-1.5 pr-5">Nama</td>
            <td className="pb-1.5 pr-5">:</td>
            <td className="pb-1.5 pr-5">{studentData?.data?.full_name}</td>
          </tr>
          <tr>
            <td className="pb-1.5 pr-5">Jumlah Hadir</td>
            <td className="pb-1.5 pr-5">:</td>
            <td className="pb-1.5 pr-5">{absenceData?.data?.presence_count || 0}</td>
          </tr>
          <tr>
            <td className="pb-1.5 pr-5">Jumlah Sakit</td>
            <td className="pb-1.5 pr-5">:</td>
            <td className="pb-1.5 pr-5">{absenceData?.data?.sick_count || 0}</td>
          </tr>
          <tr>
            <td className="pb-1.5 pr-5">Jumlah Izin</td>
            <td className="pb-1.5 pr-5">:</td>
            <td className="pb-1.5 pr-5">{absenceData?.data?.permission_count || 0}</td>
          </tr>
        </tbody>
      </table>

      <table className="mt-4 w-full border font-medium border-gray-400">
        <tbody>
          <tr className="bg-gray-100">
            <td className="px-2 py-1.5 border border-gray-400">Tanggal</td>
            <td className="px-2 py-1.5 border border-gray-400">Absensi</td>
          </tr>
          {absenceData?.data?.details?.map((detail, index) => (
            <tr key={index}>
              <td className="px-2 py-1.5 border border-gray-400">{dayjs(detail.date).format("DD MMMM YYYY")}</td>
              <td className="px-2 py-1.5 border border-gray-400">{detail.status === "Sick" ? "Sakit" : detail.status === "Present" ? "Hadir" : "Izin"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default StudentAbsence;
