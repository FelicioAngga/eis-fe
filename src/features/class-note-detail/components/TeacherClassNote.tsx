import { useEffect, useMemo, useState } from "react";
import { useTeacherScheduleQuery } from "../../../api-hooks/classnote/api";
import ClassNoteModal from "./ClassNoteModal";
import { FiEye } from "react-icons/fi";
import dayjs from "dayjs";
import { getDayOfWeek } from "../../../utils/formatDate";
import { ClassNoteModel } from "../../../api-hooks/classnote/models/ClassNoteModel";

function TeacherClassNote() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0] || "");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: teacherScheduleData } = useTeacherScheduleQuery(dayjs(selectedDate).format("YYYY-MM-DD"));
  const [selectedDaySchedule, setSelectedDaySchedule] = useState<ClassNoteModel[]>([]);
  const [editData, setEditData] = useState<ClassNoteModel | null>(null);
  const selectedDay = useMemo(() => getDayOfWeek(selectedDate), [selectedDate]);

  function handleEditClassNote(classNote: ClassNoteModel) {
    setEditData(classNote);
    setIsModalOpen(true);
  }

  useEffect(() => {
    if (!teacherScheduleData?.data || !selectedDay) {
      setSelectedDaySchedule([]);
      return;
    }
    const todaySchedule = teacherScheduleData?.data
      .filter((schedule) => schedule.day === selectedDay)
      .sort((a, b) => a.subj_sched_id - b.subj_sched_id);
    setSelectedDaySchedule(todaySchedule);
  }, [selectedDate, selectedDay, teacherScheduleData]);

  return (
    <div>
      <ClassNoteModal 
        editData={editData} 
        selectedDaySchedule={selectedDaySchedule}
        selectedDate={selectedDate} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
      <p className="font-semibold text-xl">Catatan Kelas</p>
      <div className="flex gap-4 items-center mt-8">
        <p>Tanggal :</p>
        <input
          type="date"
          className="border border-gray-300 rounded-lg px-3 py-1"
          value={selectedDate || ""}
          onChange={(e) => setSelectedDate(e.currentTarget.value || "")}
        />
        <p className="ml-5">Hari: {DAY_ENGLISH_INDONESIA[selectedDay]}</p>
      </div>

      <div className="mt-5">
        <div className="font-medium text-sm flex px-2 py-3 border border-gray-300 bg-gray-100">
          <div className="w-2/12">Kelas</div>
          <div className="w-3/12">Mata Pelajaran</div>
          <div className="w-1/12">Mulai</div>
          <div className="w-1/12">Selesai</div>
          <div className="w-4/12">Catatan Kelas</div>
          <div className="w-1/12">Aksi</div>
        </div>

        {selectedDaySchedule.map((schedule, idx) => (
          <div key={idx} className="font-medium text-sm flex px-2 py-3 border-b border-r border-l border-gray-300">
            <div className="w-2/12">{schedule.class}</div>
            <div className="w-3/12">{schedule.subject} {schedule?.teacher_act_id ? schedule.teacher_act_id !== schedule.teacher_id ? "(Infal)" : "" : ""}</div>
            <div className="w-1/12">{schedule.start_hour}</div>
            <div className="w-1/12">{schedule.end_hour}</div>
            <div className="w-4/12">{schedule.materials || "-"}</div>
            <div className="w-1/12">
              <FiEye onClick={() => handleEditClassNote(schedule)} className="size-5 cursor-pointer" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TeacherClassNote;

const DAY_ENGLISH_INDONESIA: Record<string, string> = {
  "Monday": "Senin",
  "Tuesday": "Selasa",
  "Wednesday": "Rabu",
  "Thursday": "Kamis",
  "Friday": "Jumat",
  "Saturday": "Sabtu",
  "Sunday": "Minggu"
}