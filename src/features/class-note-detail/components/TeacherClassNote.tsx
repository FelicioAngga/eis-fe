import { useState } from "react";

function TeacherClassNote() {
  const [selectedDay, setSelectedDay] = useState("Monday");
  return (
    <div>
      <div className="flex gap-5">
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

      <div className="mt-5">
        <div className="font-medium text-sm flex px-2 py-3 border border-gray-300 bg-gray-100">
          <div className="w-3/12">Kelas</div>
          <div className="w-3/12">Mulai</div>
          <div className="w-3/12">Selesai</div>
          <div className="w-3/12">Catatan Kelas</div>
        </div>
      </div>
    </div>
  )
}

export default TeacherClassNote;
