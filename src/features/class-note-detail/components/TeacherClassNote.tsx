import { useState } from "react";

function TeacherClassNote() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0] || "");

  return (
    <div>
      <p className="font-semibold text-xl">Catatan Kelas</p>
      <div className="flex gap-4 items-center mt-8">
        <p>Tanggal :</p>
        <input
          type="date"
          className="border border-gray-300 rounded-lg px-3 py-1"
          value={selectedDate || ""}
          onChange={(e) => setSelectedDate(e.currentTarget.value || "")}
        />
      </div>

      <div className="mt-5">
        <div className="font-medium text-sm flex px-2 py-3 border border-gray-300 bg-gray-100">
          <div className="w-2/12">Kelas</div>
          <div className="w-4/12">Mata Pelajaran</div>
          <div className="w-2/12">Mulai</div>
          <div className="w-2/12">Selesai</div>
          <div className="w-3/12">Catatan Kelas</div>
        </div>
      </div>
    </div>
  )
}

export default TeacherClassNote;
