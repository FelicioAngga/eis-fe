import { BsEye } from "react-icons/bs"
import { RegistrationModel } from "../../../api-hooks/registration/models/RegistrationModel"
import { useDocumentTypeQuery } from "../../../api-hooks/document-type/api";
import { previewBase64Image } from "../../../utils/base64";


function Documents({ selectedData }: { selectedData?: RegistrationModel | null }) {
  const { data: docTypes } = useDocumentTypeQuery({ pagination: { limit: 9999 }, search: "" });
  const documents = selectedData?.documents || [];

  function handleOpenFamilyCard() {
    const typeId = docTypes?.data.find(docType => docType.name.toLowerCase() === "kartu keluarga")?.id;
    const file = documents.find(doc => doc.type_id === typeId)?.uploaded_file;
    previewBase64Image(file as string);
  }

  function handleOpenBirthCertif() {
    const typeId = docTypes?.data.find(docType => docType.name.toLowerCase() === "akta kelahiran")?.id;
    const file = documents.find(doc => doc.type_id === typeId)?.uploaded_file;
    previewBase64Image(file as string);
  }

  function handleOpenGuardianId() {
    const typeId = docTypes?.data.find(docType => docType.name.toLowerCase() === "ktp orang tua")?.id;
    const file = documents.find(doc => doc.type_id === typeId)?.uploaded_file;
    previewBase64Image(file as string);
  }

  function handleOpenEducationCertif() {
    const typeId = docTypes?.data.find(docType => docType.name.toLowerCase() === "ijazah")?.id;
    const file = documents.find(doc => doc.type_id === typeId)?.uploaded_file;
    previewBase64Image(file as string);
  }
  
  function handleOpenPayment() {
    const typeId = docTypes?.data.find(docType => docType.name.toLowerCase() === "bukti pembayaran")?.id;
    const file = documents.find(doc => doc.type_id === typeId)?.uploaded_file;
    previewBase64Image(file as string);
  }

  return (
    <div className="mt-3">
      <p className="font-semibold text-gray-600">Dokumen Pendukung</p>
      <div className="mt-3 pl-2 flex flex-col gap-2.5">
        <div className="flex items-center">
          <div className="w-1/3">Kartu Keluarga Siswa</div>
          <div onClick={handleOpenFamilyCard} className="cursor-pointer"><BsEye className="text-lg" /></div>
        </div>
        <div className="flex items-center">
          <div className="w-1/3">Akte Lahir Siswa</div>
          <div onClick={handleOpenBirthCertif} className="cursor-pointer"><BsEye className="text-lg" /></div>
        </div>
        <div className="flex items-center">
          <div className="w-1/3">KTP Orang Tua/Wali</div>
          <div onClick={handleOpenGuardianId} className="cursor-pointer"><BsEye className="text-lg" /></div>
        </div>
        <div className="flex items-center">
          <div className="w-1/3">Ijazah Terakhir</div>
          <div onClick={handleOpenEducationCertif} className="cursor-pointer"><BsEye className="text-lg" /></div>
        </div>
      </div>
      <p className="font-semibold text-gray-600 mt-5">Bukti Transfer Pembayaran Pertama</p>
      <div className="flex items-center mt-3">
        <div className="w-1/3">Bukti Transfer</div>
        <div onClick={handleOpenPayment} className="cursor-pointer"><BsEye className="text-lg" /></div>
      </div>
    </div>
  )
}

export default Documents