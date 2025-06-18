import { useMemo, useState } from "react";
import { useClassDetail, useCreateClassNote, useUpdateClassNote } from "../../../api-hooks/class/api";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../../components/Button";
import { getDayOfWeek } from "../../../utils/formatDate";
import { useTeacherQuery } from "../../../api-hooks/teacher/api";
import { useAlert } from "../../../contexts/AlertContext";
import { useQueryClient } from "@tanstack/react-query";

function AdminClassNote() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const queryClient = useQueryClient();
  
  const { data: classData } = useClassDetail(id ? parseInt(id) : 0);
  const { data: teacherData } = useTeacherQuery({ pagination: { limit: 99999 }, search: ""})
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0] || "");
  const [selectedInfal, setSelectedInfal] = useState<{ subject_schedule_id: number, teacher_id: number }[]>([]);

  const lessonList = useMemo(() => {
    return classData?.data?.subject_schedules.find((schedule) => schedule.day === getDayOfWeek(selectedDate));
  }, [classData?.data.subject_schedules, selectedDate]);

  const handleInfalChange = (subjectScheduleId: number, teacherId: number) => {
    setSelectedInfal((prev) => {
      const existingIndex = prev?.findIndex(infal => infal.subject_schedule_id === subjectScheduleId);
      if (existingIndex > -1) {
        const updatedInfal = [...prev];
        updatedInfal[existingIndex].teacher_id = teacherId;
        return updatedInfal;
      } else {
        return [...prev, { subject_schedule_id: subjectScheduleId, teacher_id: teacherId }];
      }
    });
  }

  const getInfalTeacher = (subjectScheduleId: number) => {
    const classNote = classData?.data.class_notes?.find(note => note.date.split("T")[0] === selectedDate);
    return classNote?.entries.find(entry => entry.subject_schedule_id === subjectScheduleId)?.teacher_act_id || "";
  }

  const { mutateAsync: mutateCreate } = useCreateClassNote();
  const { mutateAsync: mutateUpdate } = useUpdateClassNote();

  const handleSave = async () => {
    const classNote = classData?.data.class_notes?.find(note => note.date.split("T")[0] === selectedDate);
    const selectedClassNoteDate = classData?.data?.class_notes?.find(note => note.date.split("T")[0] === selectedDate);
    if (!selectedInfal?.length) {
      showAlert({
        title: "Peringatan",
        type: "warning",
        message: "Silakan pilih penginfal terlebih dahulu",
      });
      return;
    }

    const promises = selectedInfal.map(async (infal) => {
      const classNoteToSave = classNote?.entries.find((entry) => entry.subject_schedule_id === infal.subject_schedule_id);

      if ((selectedClassNoteDate?.entries?.length || 0) > 0) {
        return await mutateUpdate({
          id: classNoteToSave?.id || 0,
          subj_sched_id: infal.subject_schedule_id,
          teacher_id: infal.teacher_id,
          materials: classNoteToSave?.materials || "",
          note_id: selectedClassNoteDate?.id || 0,
        });
      } else {
        return await mutateCreate({
          academic_id: classData?.data.id || 0,
          date: selectedDate,
          details: [{
            subj_sched_id: infal.subject_schedule_id,
            teacher_id: infal.teacher_id,
          }]
        });
      }
    });
    const responses = await Promise.all(promises);
    if (responses.every(response => response.status === 200)) {
      showAlert({
        title: "Berhasil",
        type: "success",
        message: "Infal berhasil disimpan",
      });
      queryClient.invalidateQueries({
        queryKey: ["class", classData?.data.id],
      });
    } else {
      showAlert({
        title: "Gagal",
        type: "error",
        message: "Gagal menyimpan infal, silakan coba lagi",
      });
    }
  }

  return (
    <div>
      <div className="flex justify-between">
        <div>
          <p className="font-semibold text-2xl">Jadwal Mata Pelajaran</p>
          <table className="font-medium mt-5">
            <tbody>
              <tr>
                <td className="pr-8 pb-2">Tanggal</td>
                <td className="pr-8 pb-2">:</td>
                <td className="pr-8 pb-2">
                  <input
                    type="date"
                    className="border border-gray-300 rounded-lg px-3 py-1 w-full"
                    value={selectedDate || ""}
                    onChange={(e) => setSelectedDate(e.currentTarget.value || "")}
                  />
                </td>
              </tr>
              <tr>
                <td className="pr-8 pb-2">Tahun Ajaran</td>
                <td>:</td>
                <td>{classData?.data?.start_year}/{classData?.data?.end_year}</td>
              </tr>
              <tr>
                <td className="pr-8 pb-2">Jurusan</td>
                <td>:</td>
                <td>{classData?.data?.major || "-"}</td>
              </tr>
              <tr>
                <td className="pr-8 pb-2">Kelas</td>
                <td>:</td>
                <td>{classData?.data?.classroom || "-"}</td>
              </tr>
              <tr>
                <td className="pr-8 pb-2">Wali Kelas</td>
                <td>:</td>
                <td>{classData?.data?.homeroom_teacher || "-"}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex gap-5">
          <Button onClick={handleSave} className="px-8 !py-5">Simpan</Button>
          <Button onClick={() => navigate("/class-note")} variant="outline" className="px-8 !py-5">Batal</Button>
        </div>
      </div>

      <div>
        <div className="mt-5 font-medium text-sm flex py-3 border border-gray-300 bg-gray-100">
          <div className="w-1/12 text-center">Les</div>
          <div className="w-1/12">Mulai</div>
          <div className="w-1/12">Selesai</div>
          <div className="w-4/12">Mata Pelajaran</div>
          <div className="w-2/12">Pengajar</div>
          <div className="w-3/12">Penginfal</div>
        </div>
        
        {lessonList?.entries?.map((lesson, index) => (
          <div
            key={index}
            className="font-medium text-sm flex py-3 border-b border-r border-l border-gray-300"
          >
            <div className="w-1/12 flex items-center justify-center">{index + 1}</div>
            <div className="w-1/12 flex items-center">{lesson.start_hour}</div>
            <div className="w-1/12 flex items-center">{lesson.end_hour}</div>
            <div className="w-4/12 flex items-center">{lesson.subject}</div>
            <div className="w-2/12 flex items-center">{lesson.teacher}</div>
            <div className="w-3/12 relative pr-3">
              <select 
                value={selectedInfal?.find(infal => infal.subject_schedule_id === lesson.id)?.teacher_id || getInfalTeacher(lesson.id || 0) || ""}
                onChange={(e) => handleInfalChange(lesson.id || 0, Number(e.target.value))} 
                className="w-full border border-gray-300 appearance-none rounded-md px-3 py-2.5 cursor-pointer"
              >
                <option value="">Pilih Guru</option>
                {teacherData?.data
                .filter(teacher => teacher.id !== lesson.teacher_id)
                .map(teacher => (
                  <option value={teacher.id} key={teacher.id}>{teacher.name}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-5 flex items-center px-2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdminClassNote;
