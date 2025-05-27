import Button from "../../../components/Button";
import type { UploadProps } from 'antd';
import { Upload } from 'antd';
import { useEffect, useState } from "react";
import { IoMdDocument } from "react-icons/io";
import { fileToBase64 } from "../../../utils/base64";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAlert } from "../../../contexts/AlertContext";
import { DocsTypeResponse, DocumentModel } from "../../../api-hooks/documents/models/DocumentModel";
import { useDocumentTypeQuery } from "../../../api-hooks/document-type/api";
import { useCreateDocument, useUpdateDocument } from "../../../api-hooks/documents/api";
import { useNavigate, useParams } from "react-router-dom";

type DocumentProps = {
  documentData?: DocumentModel[];
  studentId?: number;
};

function DocumentData({ documentData, studentId }: DocumentProps) {
  const { id } = useParams();
  const { Dragger } = Upload;
  const queryClient = useQueryClient();
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  const { data: docsType } = useDocumentTypeQuery();

  const [familyCardInfo, setFamilyCardInfo] = useState({
    id: 0,
    preview: "",
    name: "",
    file: null,
  });

  const [birthCertificateInfo, setBirthCertificateInfo] = useState({
    id: 0,
    preview: "",
    name: "",
    file: null,
  });

  const [guardianIdInfo, setGuardianIdInfo] = useState({
    id: 0,
    preview: "",
    name: "",
    file: null,
  });

  const [docsTypeInfo, setDocsTypeInfo] = useState({
    familyCardId: 0,
    birthCertificateId: 0,
    guardianId: 0,
  });
  
  const propsFamilyCard: UploadProps = {
    name: 'file',
    multiple: false,
    onChange(info) {
      const file = info.file.originFileObj;
      if (file) {
        if (file?.size > 1024 * 1024) {
          showAlert({ title: "Error", message: "File size exceeds 1MB", type: "error" });
          return;
        }
        const previewUrl = URL.createObjectURL(file);
        setFamilyCardInfo(prev => ({
          ...prev,
          preview: previewUrl,
          name: info.file.name,
          file: file as any,
        }));
      }
    }
  };

  const propsBirthCertificate: UploadProps = {
    name: 'file',
    multiple: false,
    onChange(info) {
      const file = info.file.originFileObj;
      if (file) {
        if (file?.size > 1024 * 1024) {
          showAlert({ title: "Error", message: "File size exceeds 1MB", type: "error" });
          return;
        }
        const previewUrl = URL.createObjectURL(file);
        setBirthCertificateInfo(prev => ({
          ...prev,
          preview: previewUrl,
          name: info.file.name,
          file: file as any,
        }));
      }
    }
  };

  const propsGuardianIdCard: UploadProps = {
    name: 'file',
    multiple: false,
    onChange(info) {
      const file = info.file.originFileObj;
      if (file) {
        if (file?.size > 1024 * 1024) {
          showAlert({ title: "Error", message: "File size exceeds 1MB", type: "error" });
          return;
        }
        const previewUrl = URL.createObjectURL(file);
        setGuardianIdInfo(prev => ({
          ...prev,
          preview: previewUrl,
          name: info.file.name,
          file: file as any,
        }));
      }
    }
  };

  const { mutate: mutateCreateDoc } = useCreateDocument();
  const { mutate: mutateUpdateDoc } = useUpdateDocument();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (data: DocumentModel[]) => {
      const promises = data.map(async (doc) => {
        if (doc.id) mutateUpdateDoc(doc);
        else mutateCreateDoc(doc);
      });
      await Promise.all(promises);
    },
    onSuccess: () => {
      showAlert({ title: "Berhasil", message: "Dokumen berhasil diupload", type: "success" });
      queryClient.invalidateQueries({
        queryKey: ["document-information"],
      });
      navigate("/student-data");
    },
    onError: (error: any) => {
      showAlert({ title: "Error", message: error.message || "Gagal mengupload dokumen", type: "error" });
    },
  });

  async function handleNext() {
    if (!id && !studentId) {
      showAlert({ title: "Error", message: "Isi Semua Data Diri Terlebih Dahulu", type: "error" });
      return;
    }
    const documentsToUpload = [];
    if (familyCardInfo.file) {
      const base64 = await fileToBase64(familyCardInfo.file);
      documentsToUpload.push({
        id: familyCardInfo.id,
        student_id: id ? +id : studentId,
        type_id: docsTypeInfo.familyCardId,
        uploaded_file: base64,
        description: familyCardInfo.name,
        name: familyCardInfo.name
      });
    }
    if (birthCertificateInfo.file) {
      const base64 = await fileToBase64(birthCertificateInfo.file);
      documentsToUpload.push({
        id: birthCertificateInfo.id,
        student_id: id ? +id : studentId,
        type_id: docsTypeInfo.birthCertificateId,
        uploaded_file: base64,
        description: birthCertificateInfo.name,
        name: birthCertificateInfo.name,
      });
    }
    if (guardianIdInfo.file) {
      const base64 = await fileToBase64(guardianIdInfo.file);
      documentsToUpload.push({
        id: guardianIdInfo.id,
        student_id: id ? +id : studentId,
        type_id: docsTypeInfo.guardianId,
        uploaded_file: base64,
        description: guardianIdInfo.name,
        name: guardianIdInfo.name
      });
    }

    if (documentsToUpload.length > 0) await mutateAsync(documentsToUpload as any);
  }

  useEffect(() => {
    if (!docsType) return;

    const getTypeId = (name: string) => docsType.data.find((doc: DocsTypeResponse) => doc.name.toLowerCase() === name)?.id;

    const typeInfo = {
      familyCardId: getTypeId("kartu keluarga") || 0,
      birthCertificateId: getTypeId("akte lahir") || 0,
      guardianId: getTypeId("ktp wali") || 0,
    };
    setDocsTypeInfo(typeInfo);

    if (!documentData?.length) return;
    const familyCard = documentData.find((doc) => doc.type_id === typeInfo.familyCardId);
    const birthCertificate = documentData.find((doc) => doc.type_id === typeInfo.birthCertificateId);
    const guardianId = documentData.find((doc) => doc.type_id === typeInfo.guardianId);

    if (familyCard) {
      setFamilyCardInfo({
        id: familyCard.id || 0,
        preview: familyCard.uploaded_file.toString(),
        name: familyCard.description,
        file: null,
      });
    }
    if (birthCertificate) {
      setBirthCertificateInfo({
        id: birthCertificate.id || 0,
        preview: birthCertificate.uploaded_file.toString(),
        name: birthCertificate.description,
        file: null,
      });
    }
    if (guardianId) {
      setGuardianIdInfo({
        id: guardianId.id || 0,
        preview: guardianId.uploaded_file.toString(),
        name: guardianId.description,
        file: null,
      });
    }
  }, [documentData, docsType]);

  useEffect(() => {
    return () => {
      if (familyCardInfo.preview) URL.revokeObjectURL(familyCardInfo.preview);
      if (birthCertificateInfo.preview) URL.revokeObjectURL(birthCertificateInfo.preview);
      if (guardianIdInfo.preview) URL.revokeObjectURL(guardianIdInfo.preview);
    };
}, [familyCardInfo, birthCertificateInfo, guardianIdInfo]);

  return (
    <div className="mt-12">
      <div className="mt-5 flex flex-col gap-8">
        <div className="border p-4 rounded md:border-none md:p-0">
          <p className="font-medium mb-3">Kartu Keluarga <span className="text-red-500">*</span></p>
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-28">
            <div className="w-[320px]">
              <Dragger {...propsFamilyCard} accept="image/*" className="block h-[220px]" showUploadList={false} multiple={false} customRequest={() => {}}>
                <IoMdDocument size={48} className="text-gray-500 mx-auto" />
                <p className="mt-4 font-medium">Click to upload or drag your file here</p>
                <p className="font-medium text-sm">
                  Max files size 1MB
                </p>
              </Dragger>
            </div>
            {familyCardInfo.preview && (
              <div className="relative">
                <img className="size-[200px] object-cover rounded-lg" src={familyCardInfo.preview} />
                <p className="text-sm mt-1">{familyCardInfo.name}</p>
              </div>
            )}
          </div>
        </div>

        <div className="border p-4 rounded md:border-none md:p-0">
          <p className="font-medium mb-3">Akte Lahir <span className="text-red-500">*</span></p>
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-28">
            <div className="w-[320px]">
              <Dragger {...propsBirthCertificate} accept="image/*" className="block h-[220px]" showUploadList={false} multiple={false} customRequest={() => {}}>
                <IoMdDocument size={48} className="text-gray-500 mx-auto" />
                <p className="mt-4 font-medium">Click to upload or drag your file here</p>
                <p className="font-medium text-sm">
                  Max files size 1MB
                </p>
              </Dragger>
            </div>
            {birthCertificateInfo.preview && (
              <div className="relative">
                <img className="size-[200px] object-cover rounded-lg" src={birthCertificateInfo.preview} />
                <p className="text-sm mt-1">{birthCertificateInfo.name}</p>
              </div>
            )}
          </div>
        </div>

        <div className="border p-4 rounded md:border-none md:p-0">
          <p className="font-medium mb-3">KTP Orang Tua / Wali <span className="text-red-500">*</span></p>
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-28">
            <div className="w-[320px]">
              <Dragger {...propsGuardianIdCard} accept="image/*" className="block h-[220px]" showUploadList={false} multiple={false} customRequest={() => {}}>
                <IoMdDocument size={48} className="text-gray-500 mx-auto" />
                <p className="mt-4 font-medium">Click to upload or drag your file here</p>
                <p className="font-medium text-sm">
                  Max files size 1MB
                </p>
              </Dragger>
            </div>
            {guardianIdInfo.preview && (
              <div className="relative">
                <img className="size-[200px] object-cover rounded-lg" src={guardianIdInfo.preview} />
                <p className="text-sm mt-1">{guardianIdInfo.name}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Button 
        disabled={!familyCardInfo.preview || !birthCertificateInfo.preview || !guardianIdInfo.preview || isPending}
        className="max-w-md flex justify-center mx-auto font-bold w-full mt-5" 
        onClick={handleNext}
      >
        Simpan
      </Button>
    </div>
  );
}

export default DocumentData;
