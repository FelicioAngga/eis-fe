import { useEffect, useRef, useState } from "react";
import defaultUser from "../../../../assets/images/default-user.jpeg";
import { StudentModel } from "../../../../api-hooks/students/models/StudentModel";
import { useUpdateStudent } from "../../../../api-hooks/students/api";
import { fileToBase64 } from "../../../../utils/base64";
import dayjs from "dayjs";

function StudentDataCard({ studentData }: { studentData?: StudentModel }) {
  const [preview, setPreview] = useState<string | null>(null);
  const inputFileRef = useRef<any>(null);

  const { mutateAsync: mutateUpdate } = useUpdateStudent();

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !studentData) return;
    const file64 = file ? await fileToBase64(file) : "";
    await mutateUpdate({
      ...studentData,
      date_of_birth: dayjs(studentData.date_of_birth).format('YYYY-MM-DD'),
      profile_pic: file64,
    })
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }

  useEffect(() => {
    if (!studentData) return;
    setPreview(studentData.profile_pic || null);
  }, [studentData]);

  return (
    <div className="border border-gray-300 rounded-lg p-2 min-w-xs">
      <div className="relative size-20 mx-auto">
        <img src={preview || defaultUser} className="rounded-full object-cover size-20" />
        <input
          onChange={handleFileChange}
          ref={inputFileRef}
          type="file"
          className="hidden"
          multiple={false}
          accept='image/*'
        />
        {/* <div onClick={() => inputFileRef.current.click()} className="rounded-full absolute right-0 bottom-0 bg-blue p-1 cursor-pointer">
          <FiEdit className="size-4 text-white" />
        </div> */}
      </div>

      <table className="w-full mt-5 font-medium text-sm">
        <tbody>
          <tr>
            <td className="pr-4 pb-6">Nama</td>
            <td className="pr-4 pb-6">:</td>
            <td className="pr-4 pb-6">{studentData?.full_name}</td>
          </tr>
          <tr>
            <td className="pr-4 pb-6">NISN</td>
            <td className="pr-4 pb-6">:</td>
            <td className="pr-4 pb-6">{studentData?.nisn}</td>
          </tr>
          <tr>
            <td className="pr-4 pb-6">NIS</td>
            <td className="pr-4 pb-6">:</td>
            <td className="pr-4 pb-6">{studentData?.nis}</td>
          </tr>
          <tr>
            <td className="pr-4 pb-6">Kelas</td>
            <td className="pr-4 pb-6">:</td>
            <td className="pr-4 pb-6">{studentData?.academics?.classroom?.display_name}</td>
          </tr>
          <tr>
            <td className="pr-4 pb-6">Jurusan</td>
            <td className="pr-4 pb-6">:</td>
            <td className="pr-4 pb-6">{studentData?.academics?.major}</td>
          </tr>
          <tr>
            <td className="pr-4 pb-6">Status</td>
            <td className="pr-4 pb-6">:</td>
            <td className="pr-4 pb-6">{studentData?.deleted_at ? 'Tidak Aktif' : 'Aktif'}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default StudentDataCard;
