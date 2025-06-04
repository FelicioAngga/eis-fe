import { Modal } from "antd"
import Form from "../../../components/Form";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import useYupValidationResolver from "../../../hooks/useYupValidationResolver";
import { Input } from "../../../components/input/Input";
import { ConfigClassSchedModel } from "../../../api-hooks/config-class-schedule/models/ConfigClassScheduleModel";
import { formatDate } from "../../../utils/formatDate";
import Button from "../../../components/Button";
import { useCreateClassNote, useUpdateClassNote } from "../../../api-hooks/class/api";
import { useAlert } from "../../../contexts/AlertContext";
import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";

interface ClassNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  editData?: ConfigClassSchedModel | null;
  selectedDate?: string;
}

function ClassNoteModal({ isOpen, onClose, editData, selectedDate }: ClassNoteModalProps) {
  const { showAlert } = useAlert();
  const queryClient = useQueryClient();
  const { classDetail } = useSelector(
    (state: RootState) => state.classAcademic
  );
  
  const yupSchema = Yup.object().shape({
    materials: Yup.string().required("Materi tidak boleh kosong"),
  });

  const resolver = useYupValidationResolver(yupSchema);

  const methods = useForm({
    mode: "onSubmit",
    resolver,
    defaultValues: {
      materials: editData?.materials || "",
    }
  }); 
  
  const { mutateAsync: mutateCreate } = useCreateClassNote();
  const { mutateAsync: mutateUpdate } = useUpdateClassNote();
  async function handleSubmit(data: { materials: string }) {
    const selectedClassNoteDate = classDetail?.class_notes?.find(note => note.date.split("T")[0] === selectedDate)
    let response;
    if ((selectedClassNoteDate?.entries?.length || 0) > 0) {
      response = await mutateUpdate({
        id: editData?.class_note_id || 0,
        subj_sched_id: editData?.id || 0,
        materials: data.materials,
        teacher_id: editData?.teacher_id || 0,
      });
    } else {
      response = await mutateCreate({
        academic_id: editData?.academic_id || 0,
        date: dayjs(selectedDate).format("YYYY-MM-DD"),
        details: [{
          ...editData,
          subj_sched_id: editData?.id || 0,
          teacher_id: editData?.teacher_id || 0,
          materials: data.materials,
        }]
      });
    }
    if (response.status === 200) {
      showAlert({
        title: "Berhasil menyimpan catatan kelas",
        message: "Catatan kelas berhasil disimpan",
        type: "success",
      });
      queryClient.invalidateQueries({
        queryKey: ["class", editData?.academic_id],
      })
      handleClose();
    } else {
      showAlert({
        title: "Gagal menyimpan catatan kelas",
        message: response.message || "Gagal menyimpan catatan kelas",
        type: "error",
      });
    }
  }

  function handleClose() {
    onClose();
    methods.reset();
  }

  useEffect(() => {
    if (!editData) return;
    methods.reset({ materials: editData.materials || "" });
  }, [editData])

  return (
    <Modal
      open={isOpen}
      footer={null}
      onCancel={handleClose}
      maskClosable={false}
      centered
      title="Catatan Kelas"
    >
      <Form methods={methods} onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4">
          <table className="font-medium">
            <tbody>
              <tr>
                <td className="pb-2 pr-5">Tanggal</td>
                <td className="pb-2 pr-5">:</td>
                <td className="pb-2 pr-5">{formatDate(selectedDate?.toString() || "")}</td>
              </tr>
              <tr>
                <td className="pb-2 pr-5">Mata Pelajaran</td>
                <td className="pb-2 pr-5">:</td>
                <td className="pb-2 pr-5">{editData?.subject}</td>
              </tr>
              <tr>
                <td className="pb-2 pr-5">Guru</td>
                <td className="pb-2 pr-5">:</td>
                <td className="pb-2 pr-5">{editData?.teacher}</td>
              </tr>
            </tbody>
          </table>
          <Input 
            type="text"
            name="materials"
            label="Materi yang disajikan"
            placeholder="Masukkan materi yang disajikan"
            required
          />
        </div>
        <div className="flex gap-5 mt-5">
          <Button type="button" onClick={handleClose} className="w-full" variant="outline">Batal</Button>
          <Button className="w-full">Simpan</Button>
        </div>
      </Form>
    </Modal>
  )
}

export default ClassNoteModal