import { useEffect, useState } from "react";
import StudentFormData from "./components/StudentFormData";
import GuardianFormData from "./components/GuardianFormData";
import ParentsFormData from "./components/ParentsFormData";
import { StudentModel } from "../../api-hooks/students/models/StudentModel";
import { GuardianModel } from "../../api-hooks/registration/models/RegistrationModel";
import { useParams } from "react-router-dom";
import { useDetailStudentQuery } from "../../api-hooks/students/api";
import DocumentData from "./components/DocumentData";

export default function () {
  const { id } = useParams();
  const [currentTab, setCurrentTab] = useState("student-data");
  const [studentFormData, setStudentFormData] = useState<StudentModel | null>(null);
  const [parentsFormData, setParentsFormData] = useState<GuardianModel[]>([]);

  const { data: detailStudent } = useDetailStudentQuery(id ? parseInt(id) : 0);

  useEffect(() => {
    if (!detailStudent) return;
    setStudentFormData({
      ...detailStudent.data,
      date_of_birth: detailStudent.data.date_of_birth ? new Date(detailStudent.data.date_of_birth).toString() : "",
    });
    setParentsFormData(detailStudent.data.guardians.map(g => ({
      ...g,
      date_of_birth: g.date_of_birth ? new Date(g.date_of_birth).toString() : "",
    })));
  }, [detailStudent])

  return (
    <div>
      <div className="flex gap-2">
        <div
          className={`px-2 py-2.5 rounded-lg text-sm font-medium text-white cursor-pointer 
          ${currentTab === "student-data" ? "bg-blue" : "bg-gray-400"}`}
          onClick={() => setCurrentTab("student-data")}
        >
          Data Diri Siswa
        </div>
        <div
          className={`px-2 py-2.5 rounded-lg text-sm font-medium text-white cursor-pointer 
          ${currentTab === "parents" ? "bg-blue" : "bg-gray-400"}`}
          onClick={() => setCurrentTab("parents")}
        >
          Data Orang Tua Siswa
        </div>
        <div
          className={`px-2 py-2.5 rounded-lg text-sm font-medium text-white cursor-pointer 
          ${currentTab === "guardian" ? "bg-blue" : "bg-gray-400"}`}
          onClick={() => setCurrentTab("guardian")}
        >
          Data Wali Siswa
        </div>
        <div
          className={`px-2 py-2.5 rounded-lg text-sm font-medium text-white cursor-pointer 
          ${currentTab === "document" ? "bg-blue" : "bg-gray-400"}`}
          onClick={() => setCurrentTab("document")}
        >
          Dokumen
        </div>
      </div>
      {currentTab === "student-data" && <StudentFormData studentFormData={studentFormData} setCurrentTab={setCurrentTab} setStudentFormData={setStudentFormData} />}
      {currentTab === "parents" && <ParentsFormData parentsFormData={parentsFormData} setCurrentTab={setCurrentTab} setParentsFormData={setParentsFormData} />}
      {currentTab === "guardian" && <GuardianFormData guardianFormData={parentsFormData} studentFormData={studentFormData} setCurrentTab={setCurrentTab} setStudentFormData={setStudentFormData} />}
      {currentTab === "document" && <DocumentData documentData={studentFormData?.documents} studentId={studentFormData?.id} />}
    </div>
  );
}
