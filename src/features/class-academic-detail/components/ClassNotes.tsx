import { BiChevronLeft } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { RootState } from "../../../store";
import { FiEdit } from "react-icons/fi";
import { useEffect, useState } from "react";
import { formatDate, getDayOfWeek } from "../../../utils/formatDate";
import { ConfigClassSchedModel } from "../../../api-hooks/config-class-schedule/models/ConfigClassScheduleModel";
import ClassNoteModal from "./ClassNoteModal";
import { changeActiveMenu } from "../classAcademicSlice";
import { useDetailClassNote } from "../../../api-hooks/class/api";
import { useBrowseAbsenceByAcademicIdAndTermId } from "../../../api-hooks/absence/api";

function ClassNotes({ parentTermId }: { parentTermId: number }) {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { classDetail } = useSelector(
    (state: RootState) => state.classAcademic
  );

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0] || "");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState<ConfigClassSchedModel | null>(null);
  const [classLesson, setClassLesson] = useState<ConfigClassSchedModel[]>([]);
  const { data: absenceData } = useBrowseAbsenceByAcademicIdAndTermId(
    id ? parseInt(id) : 0,
    parentTermId, 
    selectedDate,
    { pagination: { limit: 99999},search: "" }
  );
  const { data: classNoteDetail } = useDetailClassNote(id ? parseInt(id) : 0);

  useEffect(() => {
    if (!selectedDate) return;
    const lessonList = classDetail?.subject_schedules.find(
      (schedule) => schedule.day === getDayOfWeek(selectedDate)
    );
    let allNoteEntries = classDetail?.class_notes?.flatMap(note =>
      (note.entries || []).map(entry => ({
        ...entry,
        date: note.date,
      }))
    ) || [];
    allNoteEntries = allNoteEntries.filter(entry => {
      let isExists = false;
      classNoteDetail?.data?.forEach(item => {
        item.details?.forEach(detail => {
          if (detail.id === entry.id) isExists = true;
        });
      });
      return isExists;
    });

    const enrichedEntries = lessonList?.entries?.map(entry => {
      const matchedNote = allNoteEntries.find(
        noteEntry => noteEntry.subject_schedule_id === entry.id && noteEntry.date?.split("T")[0] === selectedDate
      );
      return {
        ...entry,
        class_note_id: matchedNote?.id || 0,
        teacher_act_id: matchedNote?.teacher_act_id,
        teacher_act: matchedNote?.teacher_act || "",
        materials: matchedNote?.materials || "",
      };
    }) || [];
    setClassLesson(enrichedEntries || []);
  }, [selectedDate, classDetail, classNoteDetail]);

  return (
    <div>
      <div
        onClick={() => dispatch(changeActiveMenu(""))}
        className="mb-4 transition-all duration-[400ms] flex items-center gap-1 hover:gap-3 text-primary cursor-pointer"
      >
        <BiChevronLeft className="text-2xl" />
        <p className="font-semibold text-sm">Kembali</p>
      </div>

      <ClassNoteModal 
        isOpen={isModalOpen}
        onClose={() => {setEditData(null); setIsModalOpen(false);}}
        editData={editData}
        selectedDate={selectedDate}
      />
      <div>
        <p className="font-semibold text-2xl">Catatan Kelas</p>
        <table className="mt-2">
          <tbody className="font-medium text-sm">
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
              <td className="pr-8 pb-3">Kelas</td>
              <td className="pr-8 pb-3">:</td>
              <td className="pr-8 pb-3">{classDetail?.classroom}</td>
            </tr>
            <tr>
              <td className="pr-8 pb-3">Jenjang</td>
              <td className="pr-8 pb-3">:</td>
              <td className="pr-8 pb-3">{classDetail?.level_name}</td>
            </tr>
            <tr>
              <td className="pr-8 pb-3">Jurusan</td>
              <td className="pr-8 pb-3">:</td>
              <td className="pr-8 pb-3">{classDetail?.major}</td>
            </tr>
            <tr>
              <td className="pr-8 pb-3">Wali Kelas</td>
              <td className="pr-8 pb-3">:</td>
              <td className="pr-8 pb-3">
                {classDetail?.homeroom_teacher || "-"}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div>
        <div className="mt-5 font-medium text-sm flex py-3 border border-gray-300 bg-gray-100">
          <div className="w-1/12 text-center">Les</div>
          <div className="w-2/12">Nama Guru</div>
          <div className="w-3/12">Mata Pelajaran</div>
          <div className="w-5/12 pr-1">Materi yang disajikan</div>
          <div className="w-1/12">Aksi</div>
        </div>

        {classLesson.map((lesson, index) => (
          <div
            key={index}
            className="font-medium text-sm flex py-3 border-b border-r border-l border-gray-300"
          >
            <div className="w-1/12 text-center">{index + 1}</div>
            <div className="w-2/12">{lesson.teacher}</div>
            <div className="w-3/12 pr-1">{lesson.subject} {(lesson.teacher_act_id != lesson.teacher_id && lesson?.teacher_act) && `(${lesson.teacher_act})`}</div>
            <div className="w-5/12">{lesson.materials || "-"}</div>
            <div className="w-1/12 text-lg">
              <FiEdit className="cursor-pointer" onClick={() => {
                setEditData({ ...lesson, academic_id: id ? parseInt(id) : 0 });
                setIsModalOpen(true);
              }} />
            </div>
          </div>
        ))}
      </div>

      {classNoteDetail?.data && (
        <div className="mt-5 w-fit min-w-xs">
          <p className="font-medium">Siswa Yang Tidak Hadir pada Tanggal {formatDate(selectedDate)} ({classDetail?.terms?.find(x => x.id === parentTermId)?.name})</p>
          <p className="text-sm font-medium">Siswa Sakit: {absenceData?.data?.students?.filter(x => x.status === "Sick").length || 0}</p>
          <p className="text-sm font-medium">Siswa Izin: {absenceData?.data?.students?.filter(x => x.status === "Permission").length || 0}</p>
          <div className="px-3 mt-5 font-medium text-sm flex py-2 border border-gray-300 bg-gray-100">
            <div className="w-full">Nama Siswa</div>
            <div className="w-full">Keterangan</div>
          </div>

          {absenceData?.data?.students?.filter(x => x.status !== "Present").map((student, index) => (
            <div
              key={index}
              className="px-3 font-medium text-sm flex py-2 border-b border-r border-l border-gray-300"
            >
              <div className="w-full">{student?.student}</div>
              <div className="w-full">{student.status === "Sick" ? "Sakit" : "Izin"}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ClassNotes;
