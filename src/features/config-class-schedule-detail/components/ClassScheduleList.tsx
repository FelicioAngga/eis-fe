import React from 'react'
import ClassScheduleForm from './ClassScheduleForm';

function ClassScheduleList() {
  const [selectedDay, setSelectedDay] = React.useState<string | null>("senin");

  return (
    <div>
      <div className="flex gap-5">
        <div 
          onClick={() => setSelectedDay("senin")}
          className={`text-sm ${selectedDay === "senin" && "border-b"} font-medium pb-1 border-blue`}
        >Senin</div>
        <div 
          onClick={() => setSelectedDay("selasa")}
          className={`text-sm ${selectedDay === "selasa" && "border-b"} font-medium pb-1 border-blue`}
        >Selasa</div>
        <div 
          onClick={() => setSelectedDay("rabu")}
          className={`text-sm ${selectedDay === "rabu" && "border-b"} font-medium pb-1 border-blue`}
        >Rabu</div>
        <div 
          onClick={() => setSelectedDay("kamis")}
          className={`text-sm ${selectedDay === "kamis" && "border-b"} font-medium pb-1 border-blue`}
        >Kamis</div>
        <div 
          onClick={() => setSelectedDay("jumat")}
          className={`text-sm ${selectedDay === "jumat" && "border-b"} font-medium pb-1 border-blue`}
        >Jumat</div>
        <div 
          onClick={() => setSelectedDay("sabtu")}
          className={`text-sm ${selectedDay === "sabtu" && "border-b"} font-medium pb-1 border-blue`}
        >Sabtu</div>
      </div>

      <ClassScheduleForm />
    </div>
  )
}

export default ClassScheduleList;