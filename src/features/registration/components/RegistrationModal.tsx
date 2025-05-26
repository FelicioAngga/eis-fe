import { Modal } from "antd";
import { RegistrationModel } from "../../../api-hooks/registration/models/RegistrationModel";
import { useState } from "react";
import StudentInformation from "./StudentInformation";
import Parents from "./Parents";
import Documents from "./Documents";
import Guardian from "./Guardian";


interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedData?: RegistrationModel | null;
}

function RegistrationModal({ selectedData, isOpen, onClose }: RegistrationModalProps) {
  const [selectedTab, setSelectedTab] = useState("student-information");
  return (
    <Modal 
      open={isOpen}
      footer={null}
      onCancel={onClose}
      maskClosable={false}
      centered
      width={600}
      title={ selectedData?.full_name || "Detail Pendaftaran"}
    >
      <div className="flex gap-2 mb-2">
        <div 
          className={`px-2 py-1.5 cursor-pointer rounded text-white text-xs ${selectedTab === "student-information" ? "bg-blue" : "bg-gray-400"}`}
          onClick={() => setSelectedTab("student-information")}
        >
          Data Siswa
        </div>
        <div 
          className={`px-2 py-1.5 cursor-pointer rounded text-white text-xs ${selectedTab === "parents" ? "bg-blue" : "bg-gray-400"}`}
          onClick={() => setSelectedTab("parents")}
        >
          Data Orang Tua Siswa
        </div>
        <div 
          className={`px-2 py-1.5 cursor-pointer rounded text-white text-xs ${selectedTab === "guardian" ? "bg-blue" : "bg-gray-400"}`}
          onClick={() => setSelectedTab("guardian")}
        >
            Data Wali Siswa
        </div>
        <div 
          className={`px-2 py-1.5 cursor-pointer rounded text-white text-xs ${selectedTab === "documents" ? "bg-blue" : "bg-gray-400"}`}
          onClick={() => setSelectedTab("documents")}
        >
          Dokumen Pendukung
        </div>
      </div>

      {selectedTab === "student-information" && <StudentInformation selectedData={selectedData} />}
      {selectedTab === "parents" && <Parents selectedData={selectedData} />}
      {selectedTab === "guardian" && <Guardian selectedData={selectedData} />}
      {selectedTab === "documents" && <Documents selectedData={selectedData} />}
    </Modal>
  )
}

export default RegistrationModal;