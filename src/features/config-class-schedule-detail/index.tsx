import { useNavigate, useParams } from "react-router-dom"
import { useClassDetail } from "../../api-hooks/class/api";
import Button from "../../components/Button";
import ClassScheduleList from "./components/ClassScheduleList";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { useAlert } from "../../contexts/AlertContext";
import { useCreateClassScheduleConfig, useUpdateClassScheduleConfig } from "../../api-hooks/config-class-schedule/api";
import { DailyClassSchedule, resetClassSchedule } from "./configClassScheduleSlice";
import { useEffect } from "react";
import { changeClassDetail } from "../class-academic-detail/classAcademicSlice";

export default function ConfigClassScheduleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const dispatch = useDispatch();
  const { data: academicDetail } = useClassDetail(id ? parseInt(id) : 0);
  const { class_schedule_list } = useSelector((state: RootState) => state.configClassSched);
  const requiredDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  function isClassScheduleValid(): boolean {
    const isValid = class_schedule_list
      .every(item => item.entries
        .every(entry => entry.subject_id && entry.teacher_id));
    if (!isValid) {
      showAlert({
        title: "Gagal menyimpan",
        type: "error",
        message: "Mohon lengkapi semua mata pelajaran dan pengajar.",
      });
      return false;
    }
    const missingDays = requiredDays.filter(day => !class_schedule_list.some(item => item.day === day));
    if (missingDays.length > 0) {
      const translatedMissingDays = missingDays.map(day => TranslatedDays[day] || day);
      showAlert({
        title: "Gagal menyimpan",
        type: "error",
        message: `Mohon lengkapi jadwal untuk hari: ${translatedMissingDays.join(", ")}`,
      });
      return false;
    }
    return true;
  }

  const { mutateAsync: mutateCreate, isPending: isCreatePending } = useCreateClassScheduleConfig();
  const { mutateAsync: mutateUpdate, isPending: isUpdatePending } = useUpdateClassScheduleConfig();
  async function handleSubmit() {
    if (!isClassScheduleValid()) return;
    let response;
    if ((academicDetail?.data?.subject_schedules?.length || 0) > 0) {
      response = await mutateUpdate({
        academic_id: id ? parseInt(id) : 0,
        entries: class_schedule_list.flatMap(item => 
          item.entries.map(entry => ({
            id: entry.id || 0,
            subject_id: entry.subject_id,
            teacher_id: entry.teacher_id,
            day: item.day,
            start_hour: entry.start_hour,
            end_hour: entry.end_hour,
          }))
        ),
      })
    } else {
      response = await mutateCreate({
        academic_id: id ? parseInt(id) : 0,
        schedules: class_schedule_list.map(item => ({
          day: item.day,
          entries: item.entries.map(entry => ({
            subject_id: entry.subject_id,
            teacher_id: entry.teacher_id,
            start_hour: entry.start_hour,
            end_hour: entry.end_hour,
          })),
        })),
      });
    }

    if (response.status === 200) {
      showAlert({
        type: "success",
        title: "Berhasil",
        message: "Jadwal berhasil disimpan.",
      });
      handleBack();
    } else {
      showAlert({
        type: "error",
        title: "Gagal",
        message: response.message || "Gagal menyimpan jadwal.",
      });
    }
  }

  function handleBack() {
    dispatch(resetClassSchedule({ class_schedule_list: [], selected_day: 'Monday' }));
    navigate("/config/class-schedule");
  }

  useEffect(() => {
    dispatch(resetClassSchedule({ class_schedule_list: [], selected_day: 'Monday' }));
    if (!academicDetail?.data?.subject_schedules?.length) return;
    const parsedScheduleArray: DailyClassSchedule[] = []
    academicDetail?.data.subject_schedules.forEach(scheduleDay => {
      parsedScheduleArray.push({
        day: scheduleDay.day,
        entries: [...scheduleDay.entries],
      })
    });
    dispatch(resetClassSchedule({ class_schedule_list: parsedScheduleArray, selected_day: 'Monday' }));
  }, [academicDetail?.data?.subject_schedules]);

  useEffect(() => {
    if (!academicDetail?.data) return;
    dispatch(changeClassDetail(academicDetail.data));
  }, [academicDetail]);

  return (
    <div>
      <div className="flex justify-between">
        <div>
          <p className="font-semibold text-2xl">Jadwal Mata Pelajaran</p>
          <table className="font-medium mt-5">
            <tbody>
              <tr>
                <td className="pr-8 pb-2">Tahun Ajaran</td>
                <td>:</td>
                <td className="pl-8">{academicDetail?.data?.start_year}/{academicDetail?.data?.end_year}</td>
              </tr>
              <tr>
                <td className="pr-8 pb-2">Jurusan</td>
                <td>:</td>
                <td className="pl-8">{academicDetail?.data?.major || "-"}</td>
              </tr>
              <tr>
                <td className="pr-8 pb-2">Kelas</td>
                <td>:</td>
                <td className="pl-8">{academicDetail?.data?.classroom || "-"}</td>
              </tr>
              <tr>
                <td className="pr-8 pb-2">Kurikulum</td>
                <td>:</td>
                <td className="pl-8">{academicDetail?.data?.curriculum || "-"}</td>
              </tr>
              <tr>
                <td className="pr-8 pb-2">Wali Kelas</td>
                <td>:</td>
                <td className="pl-8">{academicDetail?.data?.homeroom_teacher || "-"}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex gap-5">
          <Button disabled={isCreatePending || isUpdatePending} onClick={handleSubmit} className="px-8 !py-5">Simpan</Button>
          <Button onClick={handleBack} variant="outline" className="px-8 !py-5">Batal</Button>
        </div>
      </div>

      <ClassScheduleList />
    </div>
  )
}

export const TranslatedDays: Record<string,string> = {
  "Monday": "Senin",
  "Tuesday": "Selasa",
  "Wednesday": "Rabu",
  "Thursday": "Kamis",
  "Friday": "Jumat",
  "Saturday": "Sabtu",
}