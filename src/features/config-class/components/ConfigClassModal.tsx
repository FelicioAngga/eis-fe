import { Modal } from "antd";
import Form from "../../../components/Form";
import { useCreateConfigClass, useUpdateConfigClass } from "../../../api-hooks/config-class/api";
import { ConfigClassModel } from "../../../api-hooks/config-class/models/ConfigClassModel";
import useYupValidationResolver from "../../../hooks/useYupValidationResolver";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { useAlert } from "../../../contexts/AlertContext";
import * as Yup from "yup";
import { Input } from "../../../components/input/Input";
import Button from "../../../components/Button";
import { useGradeQuery } from "../../../api-hooks/grade/api";
import { useEffect, useMemo } from "react";

interface ConfigClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  editData: ConfigClassModel | null;
}

function ConfigClassModal({ isOpen, onClose, editData }: ConfigClassModalProps) {
  const queryClient = useQueryClient();
  const { showAlert } = useAlert();
  const { data: gradeData } = useGradeQuery({
    pagination: { limit: 999 },
    search: "",
  });

  const yupSchema = Yup.object().shape({
    display_name: Yup.string().required("Nama tidak boleh kosong"),
    level_id: Yup.string().required("Jenjang tidak boleh kosong"),
    grade: Yup.string().required("Tingkat tidak boleh kosong"),
    name: Yup.string().required("Kelas tidak boleh kosong"),
  });

  const resolver = useYupValidationResolver(yupSchema);
  const defaultValues = useMemo(() => {
    return {
      id: editData?.id || 0,
      display_name: editData?.display_name || "",
      level_id: editData?.level_id?.toString() || "",
      grade: editData?.grade || "",
      name: editData?.name || "",
    };
  }, [editData, isOpen]);

  const methods = useForm({
    mode: "onSubmit",
    resolver,
    defaultValues,
  });

  const { mutateAsync: mutateCreate, isPending: isCreatePending } = useCreateConfigClass();
  const { mutateAsync: mutateUpdate, isPending: isUpdatePending } = useUpdateConfigClass();
  const handleSubmit = async (data: ConfigClassModel) => {
    const mutateAsync = editData ? mutateUpdate : mutateCreate;
    const response = await mutateAsync({
      ...data,
      id: editData?.id,
      level_id: parseInt(data.level_id.toString()),
    });
    if (response.status === 200) {
      showAlert({
        title: "Berhasil",
        type: "success",
        message: "Berhasil menambah konfigurasi kelas",
      });
      queryClient.invalidateQueries({
        queryKey: ["classrooms"],
      });
      onClose();
    } else {
      showAlert({
        title: "Gagal",
        type: "error",
        message: response.error || "Gagal menambah konfigurasi kelas",
      });
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      methods.reset(defaultValues);
    })
    return () => clearTimeout(timeoutId)
  }, [defaultValues]);

  return (
    <Modal
      open={isOpen}
      footer={null}
      onCancel={onClose}
      maskClosable={false}
      centered
      title={`${editData ? "Edit" : "Tambah"}  Konfigurasi Kelas`}
    >
      <Form methods={methods} onSubmit={handleSubmit}>
        <div className="flex flex-col gap-3">
          <Input
            type="text"
            name="display_name"
            placeholder="Nama"
            label="Nama"
            required
          />
          <Input
            type="select"
            name="level_id"
            placeholder="Jenjang"
            label="Jenjang"
            options={
              gradeData?.data.map((grade) => ({
                value: grade.id?.toString() || "",
                label: grade.name,
              })) || []
            }
            required
          />
          <Input
            type="select"
            name="grade"
            placeholder="Tingkat"
            label="Tingkat"
            options={[
              { value: "1", label: "1" },
              { value: "2", label: "2" },
              { value: "3", label: "3" },
              { value: "4", label: "4" },
              { value: "5", label: "5" },
              { value: "6", label: "6" },
            ]}
            required
          />
          <Input
            type="text"
            name="name"
            placeholder="Kelas"
            label="Kelas"
            required
          />
          <Button disabled={isCreatePending || isUpdatePending} className="mt-5">Simpan</Button>
        </div>
      </Form>
    </Modal>
  );
}

export default ConfigClassModal;
