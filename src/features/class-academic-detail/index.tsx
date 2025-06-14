import { useNavigate, useParams } from "react-router-dom";
import { useClassDetail, useUpdateAcademic } from "../../api-hooks/class/api";
import ClassAcademicTable from "./components/ClassAcademicTable";
import Button from "../../components/Button";
import { FiEye } from "react-icons/fi";
import { useTeacherQuery } from "../../api-hooks/teacher/api";
import { useEffect, useState } from "react";
import { useAlert } from "../../contexts/AlertContext";
import { useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import ClassNotes from "./components/ClassNotes";
import { changeActiveMenu, changeClassDetail } from "./classAcademicSlice";
import { BiChevronLeft } from "react-icons/bi";
import ClassMarks from "./components/ClassMarks";

export default function ClassAcademicDetail() {
  const { id } = useParams();
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const { activeMenu } = useSelector((state: RootState) => state.classAcademic);

  const { data: classDetail } = useClassDetail(id ? parseInt(id) : 0);
  const [termId, setTermId] = useState<number>(classDetail?.data.terms?.[0]?.id || 0);
  const { data: teacherData } = useTeacherQuery({ pagination: { limit: 99999 }, search: "" });
  const [homeRoomTeacherId, setHomeRoomTeacherId] = useState<number | null>(null);
  const [major, setMajor] = useState<string>("General");

  const { mutateAsync, isPending } = useUpdateAcademic();
  async function saveHomeRoomTeacher() {
    if (!homeRoomTeacherId || !classDetail) {
      showAlert({
        title: "Peringatan",
        type: "warning",
        message: "Wali kelas belum dipilih",
      });
      return;
    }

    const studentIdArray = classDetail?.data.students?.map(student => student.id);
    const response = await mutateAsync({
      ...classDetail?.data,
      students: studentIdArray as any,
      major: major,
      homeroom_teacher_id: homeRoomTeacherId,
    });
    if (response.status === 200) {
      showAlert({
        title: "Sukses",
        type: "success",
        message: "Data berhasil disimpan",
      });
      queryClient.invalidateQueries({ queryKey: ["class"] });
    } else {
      showAlert({
        title: "Error",
        type: "error",
        message: response.message || "Gagal menyimpan Data",
      });
    }
  }

  useEffect(() => {
    if (!classDetail?.data) return;
    dispatch(changeClassDetail(classDetail.data))
    setMajor(classDetail.data.major || "General");
    setHomeRoomTeacherId(classDetail.data.homeroom_teacher_id || null);
    setTermId(classDetail.data.terms?.[0]?.id || 0);
  }, [classDetail]);

  useEffect(() => {
    return () => {
      dispatch(changeActiveMenu(""));
      setHomeRoomTeacherId(null);
    }
  }, []);

  if (activeMenu === "class-note") return <ClassNotes parentTermId={termId} />
  if (activeMenu === "class-marks") return <ClassMarks setTermId={setTermId} termId={termId} />
  
  if (!activeMenu) return (
    <div>
      <div
        onClick={() => navigate("/academic")}
        className="mb-2 transition-all duration-[400ms] flex items-center gap-1 hover:gap-3 text-primary cursor-pointer"
      >
        <BiChevronLeft className="text-2xl" />
        <p className="font-semibold text-sm">Kembali</p>
      </div>

      <div className="flex justify-between">
        <div>
          <p className="font-semibold text-2xl">Data Kelas</p>
          <table className="mt-5">
            <tbody className="font-medium text-sm">
              <tr>
                <td className="pr-8 pb-3">Kelas</td>
                <td className="pr-8 pb-3">:</td>
                <td className="pr-8 pb-3">{classDetail?.data.classroom}</td>
              </tr>
              <tr>
                <td className="pr-8 pb-3">Jenjang</td>
                <td className="pr-8 pb-3">:</td>
                <td className="pr-8 pb-3">{classDetail?.data.level_name}</td>
              </tr>
              <tr>
                <td className="pr-8 pb-3">Jurusan</td>
                <td className="pr-8 pb-3">:</td>
                <td className="pr-8 pb-3">
                  <div className="relative pr-3">
                    <select
                      value={major || ""}
                      onChange={(e) => e.target.value ? setMajor(e.target.value) : null}
                      className="w-full min-w-[240px] border border-gray-300 appearance-none rounded-md px-3 py-2.5 cursor-pointer"
                    >
                      <option value="">Pilih Jurusan</option>
                      <option value="General">General</option>
                      <option value="IPA">IPA</option>
                      <option value="IPS">IPS</option>
                    </select>
                    <div className="absolute inset-y-0 right-5 flex items-center px-2 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="pr-8 pb-2">Semester</td>
                <td className="pr-8 pb-2">:</td>
                <td className="pr-8 pb-2">
                  <div className="relative pr-3">
                    <select
                      className="w-full border border-gray-300 appearance-none rounded-md px-3 py-2 cursor-pointer"
                      onChange={(e) => setTermId(parseInt(e.currentTarget.value))}
                      value={termId}
                    >
                      {classDetail?.data?.terms?.map(term => 
                        <option value={term.id} key={term.id}>{term.name}</option>
                      )}
                    </select>
                    <div className="absolute inset-y-0 right-5 flex items-center px-2 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="pr-8 pb-3">Wali Kelas</td>
                <td className="pr-8 pb-3">:</td>
                <td className="pr-8 pb-3">
                  <div className="relative pr-3">
                    <select
                      value={(homeRoomTeacherId || classDetail?.data.homeroom_teacher_id) || ""}
                      onChange={(e) => e.target.value ? setHomeRoomTeacherId(e.target.value ? parseInt(e.target.value): null) : null}
                      className="w-full min-w-[240px] border border-gray-300 appearance-none rounded-md px-3 py-2.5 cursor-pointer"
                    >
                      <option value="">Pilih Wali Kelas</option>
                      {teacherData?.data.map(teacher => (
                        <option value={teacher.id} key={teacher.id}>{teacher.name} - {teacher.nuptk}</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-5 flex items-center px-2 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="pr-8 pb-3">Jadwal Kelas</td>
                <td className="pr-8 pb-3">:</td>
                <td className="pr-8 pb-3">
                  <div 
                    onClick={() => (navigate(`/config/class-schedule/detail/${id}`))}
                    className="flex gap-2 items-center rounded border border-gray-500 px-2 py-1 cursor-pointer w-fit"
                  >
                    <p>View</p>
                    <FiEye className="text-lg" />
                  </div>
                </td>
              </tr>
              <tr>
                <td className="pr-8 pb-3">Kehadiran Kelas</td>
                <td className="pr-8 pb-3">:</td>
                <td className="pr-8 pb-3">
                  <div 
                    onClick={() => (navigate(`/absence/detail/${id}`))}
                    className="flex gap-2 items-center rounded border border-gray-500 px-2 py-1 cursor-pointer w-fit"
                  >
                    <p>View</p>
                    <FiEye className="text-lg" />
                  </div>
                </td>
              </tr>
              <tr>
                <td className="pr-8 pb-3">Nilai Kelas</td>
                <td className="pr-8 pb-3">:</td>
                <td className="pr-8 pb-3">
                  <div 
                    onClick={() => dispatch(changeActiveMenu("class-marks"))} 
                    className="flex gap-2 items-center rounded border border-gray-500 px-2 py-1 cursor-pointer w-fit"
                  >
                    <p>View</p>
                    <FiEye className="text-lg" />
                  </div>
                </td>
              </tr>
              <tr>
                <td className="pr-8 pb-3">Catatan Kelas</td>
                <td className="pr-8 pb-3">:</td>
                <td className="pr-8 pb-3">
                  <div 
                    onClick={() => dispatch(changeActiveMenu("class-note"))} 
                    className="flex gap-2 items-center rounded border border-gray-500 px-2 py-1 cursor-pointer w-fit"
                  >
                    <p>View</p>
                    <FiEye className="text-lg" />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <Button disabled={isPending} onClick={saveHomeRoomTeacher}>Simpan</Button>
      </div>

      <div className="my-5 bg-gray-400 h-[1px]"></div>
      <ClassAcademicTable termId={termId} />
    </div>
  );
}