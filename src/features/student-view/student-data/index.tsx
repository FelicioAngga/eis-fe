
import dayjs from "dayjs";
import { useDetailStudentByToken } from "../../../api-hooks/students/api";
import StudentDataCard from "./components/StudentDataCard";
import { useMemo, useState } from "react";
import { FiEdit } from "react-icons/fi";
import StudentDataModal from "./components/StudentDataModal";

function StudentViewData() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: studentData } = useDetailStudentByToken();
  const fatherData = useMemo(() => {
    return studentData?.data.guardians?.find(guardian => guardian.relation === "father");
  }, [studentData?.data.guardians]);
  
  const motherData = useMemo(() => {
    return studentData?.data.guardians?.find(guardian => guardian.relation === "mother");
  }, [studentData?.data.guardians]);

  return (
    <div className="flex gap-5">
      <StudentDataModal editData={studentData?.data} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <StudentDataCard studentData={studentData?.data} />
      <div className="w-full border border-gray-300 rounded-lg p-3">
        <div className="flex justify-between">
          <p className="text-2xl font-medium">Data Diri Pribadi</p>
          <FiEdit className="size-7 cursor-pointer" onClick={() => setIsModalOpen(true)} />
        </div>
        <table className="mt-5 font-medium text-sm">
          <tbody>
            <tr>
              <td className="pr-3 pb-6">NIK</td>
              <td className="pr-3 pb-6">:</td>
              <td className="pr-3 pb-6">{studentData?.data.identity_no}</td>
            </tr>
            <tr>
              <td className="pr-3 pb-6">Tempat, Tanggal Lahir</td>
              <td className="pr-3 pb-6">:</td>
              <td className="pr-3 pb-6">{studentData?.data.place_of_birth}, {dayjs(studentData?.data.date_of_birth).format("DD MMMM YYYY")}</td>
            </tr>
            <tr>
              <td className="pr-3 pb-6">Agama</td>
              <td className="pr-3 pb-6">:</td>
              <td className="pr-3 pb-6">{studentData?.data.religion}</td>
            </tr>
            <tr>
              <td className="pr-3 pb-6">Alamat</td>
              <td className="pr-3 pb-6">:</td>
              <td className="pr-3 pb-6">{studentData?.data.address}</td>
            </tr>
            <tr>
              <td className="pr-3 pb-6">Telepon</td>
              <td className="pr-3 pb-6">:</td>
              <td className="pr-3 pb-6">{studentData?.data.phone || "-"}</td>
            </tr>
            <tr>
              <td className="pr-3 pb-6">Email</td>
              <td className="pr-3 pb-6">:</td>
              <td className="pr-3 pb-6">{studentData?.data.email}</td>
            </tr>
          </tbody>
        </table>

        <p className="text-2xl font-medium mt-5">Data Orang Tua</p>
        <table className="mt-5 font-medium text-sm">
          <tbody>
            <tr>
              <td className="pr-3 pb-6">Nama Ayah</td>
              <td className="pr-3 pb-6">:</td>
              <td className="pr-3 pb-6">{fatherData?.name}</td>
            </tr>
            <tr>
              <td className="pr-3 pb-6">No Telepon Ayah</td>
              <td className="pr-3 pb-6">:</td>
              <td className="pr-3 pb-6">{fatherData?.phone}</td>
            </tr>
            <tr>
              <td className="pr-3 pb-6">Nama Ibu</td>
              <td className="pr-3 pb-6">:</td>
              <td className="pr-3 pb-6">{motherData?.name}</td>
            </tr>
            <tr>
              <td className="pr-3 pb-6">No Telepon Ibu</td>
              <td className="pr-3 pb-6">:</td>
              <td className="pr-3 pb-6">{motherData?.phone}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default StudentViewData