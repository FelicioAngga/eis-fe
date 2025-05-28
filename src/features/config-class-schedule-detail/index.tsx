import { useParams } from "react-router-dom"
import { useClassDetail } from "../../api-hooks/class/api";
import Button from "../../components/Button";
import ClassScheduleList from "./components/ClassScheduleList";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { useAlert } from "../../contexts/AlertContext";

export default function() {
  const { id } = useParams();
  const { showAlert } = useAlert();
  const { data: academicDetail } = useClassDetail(id ? parseInt(id) : 0);
  const { class_schedule_list } = useSelector((state: RootState) => state.configClassSched);

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
    return true;
  }
  
  function handleSubmit() {
    if (!isClassScheduleValid()) return;
    console.log({
      academic_id: id,
      class_schedule_list,
    });
  }

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
                <td className="pl-8">{academicDetail?.data?.classroom?.display_name || "-"}</td>
              </tr>
              <tr>
                <td className="pr-8 pb-2">Wali Kelas</td>
                <td>:</td>
                <td className="pl-8">{academicDetail?.data?.homeroom_teacher?.name || "-"}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex gap-5">
          <Button onClick={handleSubmit} className="px-8 !py-5">Simpan</Button>
          <Button variant="outline" className="px-8 !py-5">Batal</Button>
        </div>
      </div>

      <ClassScheduleList />
    </div>
  )
}