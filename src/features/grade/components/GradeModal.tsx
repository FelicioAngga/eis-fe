import { Modal } from "antd"
import { GradeDetailModel, GradeModel } from "../../../api-hooks/grade/models/GradeModel";
import Form from "../../../components/Form";
import { useUpdateGrade } from "../../../api-hooks/grade/api";
import useYupValidationResolver from "../../../hooks/useYupValidationResolver";
import { useEffect, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAlert } from "../../../contexts/AlertContext";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { Input } from "../../../components/input/Input";
import Button from "../../../components/Button";
import { useUserQuery } from "../../../api-hooks/users/api";

interface GradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  editData?: GradeModel | null;
}

function GradeModal({ isOpen, onClose, editData }: GradeModalProps) {
  const { showAlert } = useAlert();
  const queryClient = useQueryClient();
  const { data: userList } = useUserQuery({ pagination: { limit: 99999 }, search: "" });
  
  const yupSchema = Yup.object().shape({
    op_cert_num: Yup.string(),
    npsn: Yup.string(),
    accreditation: Yup.string(),
    curriculum: Yup.string(),
    email: Yup.string().email("Email tidak valid"),
    phone: Yup.string(),
    principle_id: Yup.string(),
    operator_id: Yup.string(),
  });

  const resolver = useYupValidationResolver(yupSchema);
  const defaultValues = useMemo(() => {
    return {
      op_cert_num: editData?.currentHistory?.op_cert_num || "",
      npsn: editData?.currentHistory?.npsn || "",
      accreditation: editData?.currentHistory?.accreditation || "",
      curriculum: editData?.currentHistory?.curriculum || "",
      email: editData?.currentHistory?.email || "",
      phone: editData?.currentHistory?.phone || "",
      principle_id: editData?.currentHistory?.principle_id?.toString() || "",
      operator_id: editData?.currentHistory?.operator_id?.toString() || "",
    };
  }, [editData])

  const methods = useForm({
    mode: "onSubmit",
    resolver,
    defaultValues,
  });

  const { formState: { isValid } } = methods;

  const { mutateAsync, isPending } = useUpdateGrade();

  const handleSubmit = async (data: GradeDetailModel) => {
    const response = await mutateAsync({
      ...data,
      level_id: editData?.id || 0,
      principle_id: +(data?.principle_id || 0) || null,
      operator_id: +(data?.operator_id || 0) || null,
    });
    if (response.status === 200) {
      queryClient.invalidateQueries({
        queryKey: ["levels"]
      });
      showAlert({
        title: "Berhasil",
        message: "Berhasil mengedit data",
        type: "success",
      });
      handleClose();
    } else {
      showAlert({
        title: "Gagal",
        message: response.message || "Gagal mengedit data",
        type: "error",
      });
    }
  };

  const handleClose = () => {
    methods.reset();
    onClose();
  };

  useEffect(() => {
    if (defaultValues) methods.reset(defaultValues);
  }, [defaultValues]);

  return (
    <Modal
      open={isOpen}
      footer={null}
      onCancel={handleClose}
      maskClosable={false}
      centered
      title={editData?.name}
    >
      <Form methods={methods} onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4">
          <Input 
            type="text" 
            name="op_cert_num" 
            label="SK Operasional" 
            placeholder="Masukkan SK Operasional" 
          />
          <Input 
            type="text" 
            name="npsn" 
            label="NPSN (Nomor Pokok Sekolah Nasional)" 
            placeholder="Masukkan NPSN" 
          />
          <Input 
            type="select" 
            name="accreditation" 
            label="Akreditasi" 
            placeholder="Masukkan Akreditasi" 
            options={[
              { label: "A", value: "A" },
              { label: "B", value: "B" },
              { label: "C", value: "C" },
              { label: "Tidak Terakreditasi", value: "Tidak Terakreditasi" }
            ]}
          />
          <Input 
            type="text" 
            name="curriculum" 
            label="Kurikulum" 
            placeholder="Masukkan Kurikulum"
          />
          <Input 
            type="text" 
            name="email" 
            label="Email" 
            placeholder="Masukkan Email"
          />
          <Input 
            type="number" 
            name="phone" 
            label="No Telp" 
            placeholder="Masukkan No Telp"
          />
          <Input 
            type="select"
            name="principle_id"
            label="Kepala Sekolah"
            placeholder="Pilih Kepala Sekolah"
            options={userList?.data?.map(user => ({ label: user.name, value: user?.id?.toString() || "" }))}
          />
          <Input 
            type="select"
            name="operator_id"
            label="Operator"
            placeholder="Pilih Operator"
            options={userList?.data?.map(user => ({ label: user.name, value: user?.id?.toString() || "" }))}
          />

          <div className="flex gap-4 mt-4">
            <Button type="button" onClick={handleClose} className="w-full" variant="outline">Batal</Button>
            <Button className="w-full" disabled={isPending || !isValid}>Edit</Button>
          </div>
        </div>
      </Form>
    </Modal>
  )
}

export default GradeModal