import { useMemo, useState } from "react";
import { useGetStudentScheduleByToken } from "../../../api-hooks/config-class-schedule/api"
import { useDetailStudentByToken } from "../../../api-hooks/students/api";

function StudentSchedule() {
  const [selectedDay, setSelectedDay] = useState("Monday");
  const { data: studentData } = useDetailStudentByToken();
  const { data: studentSchedule } = useGetStudentScheduleByToken();
  const scheduleForSelectedDay = useMemo(() => {
    return studentSchedule?.data?.filter(schedule => schedule.day === selectedDay).shift();
  }, [studentSchedule, selectedDay]);
  
  return (
    <div>
      <p className="text-xl font-semibold">Jadwal Mata Pelajaran</p>
      <table className="mt-4 font-medium text-sm">
        <tbody>
          <tr>
            <td className="pb-1.5 pr-5">Tahun Ajaran</td>
            <td className="pb-1.5 pr-5">:</td>
            <td className="pb-1.5 pr-5">{studentData?.data?.academics?.start_year}/{studentData?.data?.academics?.end_year}</td>
          </tr>
          <tr>
            <td className="pb-1.5 pr-5">Jurusan</td>
            <td className="pb-1.5 pr-5">:</td>
            <td className="pb-1.5 pr-5">{studentData?.data?.academics?.major}</td>
          </tr>
          <tr>
            <td className="pb-1.5 pr-5">Kelas</td>
            <td className="pb-1.5 pr-5">:</td>
            <td className="pb-1.5 pr-5">{studentData?.data?.academics?.classroom?.display_name}</td>
          </tr>
          <tr>
            <td className="pb-1.5 pr-5">Wali Kelas</td>
            <td className="pb-1.5 pr-5">:</td>
            <td className="pb-1.5 pr-5">{(studentData?.data?.academics?.homeroom_teacher as any)?.name}</td>
          </tr>
        </tbody>
      </table>

      <div className="flex gap-5 mt-6">
        <div 
          onClick={() => setSelectedDay("Monday")}
          className={`text-sm ${selectedDay === "Monday" && "border-b"} font-medium pb-1 cursor-pointer border-blue`}
        >Senin</div>
        <div 
          onClick={() => setSelectedDay("Tuesday")}
          className={`text-sm ${selectedDay === "Tuesday" && "border-b"} font-medium pb-1 cursor-pointer border-blue`}
        >Selasa</div>
        <div 
          onClick={() => setSelectedDay("Wednesday")}
          className={`text-sm ${selectedDay === "Wednesday" && "border-b"} font-medium pb-1 cursor-pointer border-blue`}
        >Rabu</div>
        <div 
          onClick={() => setSelectedDay("Thursday")}
          className={`text-sm ${selectedDay === "Thursday" && "border-b"} font-medium pb-1 cursor-pointer border-blue`}
        >Kamis</div>
        <div 
          onClick={() => setSelectedDay("Friday")}
          className={`text-sm ${selectedDay === "Friday" && "border-b"} font-medium pb-1 cursor-pointer border-blue`}
        >Jumat</div>
        <div 
          onClick={() => setSelectedDay("Saturday")}
          className={`text-sm ${selectedDay === "Saturday" && "border-b"} font-medium pb-1 cursor-pointer border-blue`}
        >Sabtu</div>
      </div>
      
      <table className="mt-4 w-full border font-medium border-gray-400">
        <tbody>
          <tr className="bg-gray-100">
            <td className="px-2 py-1.5 border border-gray-400">Mulai</td>
            <td className="px-2 py-1.5 border border-gray-400">Selesai</td>
            <td className="px-2 py-1.5 border border-gray-400">Mata Pelajaran</td>
            <td className="px-2 py-1.5 border border-gray-400">Pengajar</td>
          </tr>
          {scheduleForSelectedDay?.details.map((schedule, index) => (
            <tr key={index}>
              <td className="px-2 py-1.5 border border-gray-400">{schedule.start_hour}</td>
              <td className="px-2 py-1.5 border border-gray-400">{schedule.end_hour}</td>
              <td className="px-2 py-1.5 border border-gray-400">{schedule.subject}</td>
              <td className="px-2 py-1.5 border border-gray-400">{schedule.teacher}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default StudentSchedule