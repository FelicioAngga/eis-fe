import { Modal } from "antd";
import { useCreateDocument, useUpdateDocument } from "../../../api-hooks/documents/api";
import useYupValidationResolver from "../../../hooks/useYupValidationResolver";
import { useForm } from "react-hook-form";
import { useAlert } from "../../../contexts/AlertContext";
import { useQueryClient } from "@tanstack/react-query";
import * as Yup from "yup";
import Form from "../../../components/Form";
import { Input } from "../../../components/input/Input";
import Button from "../../../components/Button";
import { useEffect, useMemo, useRef } from "react";
import { DocumentCreateModel, DocumentModel } from "../../../api-hooks/documents/models/DocumentModel";
import { fileToBase64 } from "../../../utils/base64";
import { useDocumentTypeQuery } from "../../../api-hooks/document-type/api";

interface DocModalProps {
  isOpen: boolean;
  onClose: () => void;
  editData?: DocumentModel | null;
}

function AddDocumentModal({ isOpen, onClose, editData }: DocModalProps) {
  const fileInputRef = useRef<any>(null);
  const { showAlert } = useAlert();
  const queryClient = useQueryClient();
  const { data: docTypeData } = useDocumentTypeQuery({ pagination: { limit: 999 }, search: "" });
  
  const yupSchema = Yup.object().shape({
    uploaded_file: Yup.mixed().required("File tidak boleh kosong"),
    type_id: Yup.string().required("Tipe dokumen tidak boleh kosong"),
    description: Yup.string(),
  });

  const resolver = useYupValidationResolver(yupSchema);
  const defaultValues = useMemo(() => {
    return {
      description: editData?.description || "",
      type_id: editData?.type_id?.toString() || "",
      uploaded_file: editData?.uploaded_file || "",
    };
  }, [editData])

  const methods = useForm({
    mode: "onSubmit",
    resolver,
    defaultValues,
  });

  const { formState: { isValid } } = methods;

  const { mutateAsync, isPending } = editData ? useUpdateDocument() : useCreateDocument();

  const handleSubmit = async (data: DocumentCreateModel) => {
    const base64File = await fileToBase64(data.uploaded_file as any);
    const response = await mutateAsync({
      ...data,
      id: editData?.id || 0,
      name: (data.uploaded_file as any).name,
      type_id: +data.type_id,
      uploaded_file: base64File
    });
    if (response.status === 200) {
      showAlert({
        title: "Berhasil",
        type: "success",
        message: `Berhasil ${editData ? "mengedit" : "menambah"} dokumen`,
      });
      queryClient.invalidateQueries({
        queryKey: ["documents"],
      });
      handleClose();
    } else {
      showAlert({
        title: "Gagal",
        type: "error",
        message: response.error || `Gagal ${editData ? "mengedit" : "menambah"} dokumen`,
      });
    }
  };

  const handleClose = () => {
    if (fileInputRef.current) fileInputRef.current.resetFile();
    methods.reset();
    onClose();
  }

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (defaultValues && docTypeData) {
      timeoutId = setTimeout(() => {
        methods.reset(defaultValues);
        if (fileInputRef.current) fileInputRef.current.setFile(defaultValues.uploaded_file);
      });
    }
    return () => clearTimeout(timeoutId);
  }, [defaultValues, docTypeData]);

  return (
    <Modal
      open={isOpen}
      footer={null}
      onCancel={handleClose}
      maskClosable={false}
      centered
      title={editData ? "Edit Dokumen" : "Tambah Dokumen"}
    >
      <Form methods={methods} onSubmit={handleSubmit}>
        <div>
          <div className="flex flex-col gap-4">
            <Input ref={fileInputRef} type="file" name="uploaded_file" placeholder="File" label="File" required />
            <Input
              type="select"
              name="type_id"
              label="Tipe Dokumen"
              placeholder="Pilih Tipe Dokumen"
              required
              options={docTypeData?.data.map((docType) => ({
                value: docType.id.toString(),
                label: docType.name,
              }))}
            />
            <Input type="textarea" rows={3} name="description" placeholder="Deskripsi" label="Deskripsi" />
          </div>
          <div className="flex gap-4 mt-8">
            <Button type="button" onClick={handleClose} className="w-full" variant="outline">Batal</Button>
            <Button className="w-full" disabled={isPending || !isValid}>{editData ? "Edit" : "Tambah"}</Button>
          </div>
        </div>
      </Form>
    </Modal>
  )
}

export default AddDocumentModal