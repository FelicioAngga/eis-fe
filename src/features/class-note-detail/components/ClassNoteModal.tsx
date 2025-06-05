import { Modal } from "antd"
import Form from "../../../components/Form";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import useYupValidationResolver from "../../../hooks/useYupValidationResolver";
import { Input } from "../../../components/input/Input";
import { formatDate } from "../../../utils/formatDate";
import Button from "../../../components/Button";
import { useCreateClassNote, useUpdateClassNote } from "../../../api-hooks/class/api";
import { useAlert } from "../../../contexts/AlertContext";
import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { ClassNoteModel } from "../../../api-hooks/classnote/models/ClassNoteModel";
import { BiChevronLeft } from "react-icons/bi";

interface ClassNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  editData?: ClassNoteModel | null;
  selectedDaySchedule?: ClassNoteModel[];
  selectedDate?: string;
}

function ClassNoteModal({ isOpen, onClose, editData, selectedDate, selectedDaySchedule }: ClassNoteModalProps) {
  const { showAlert } = useAlert();
  const queryClient = useQueryClient();
  const [showDetail, setShowDetail] = useState(false);
  
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
    const noteId = selectedDaySchedule?.find(x => !!x.note_id)?.note_id;
    let response;
    if (noteId) {
      response = await mutateUpdate({
        id: editData?.id || 0,
        subj_sched_id: editData?.subj_sched_id || 0,
        materials: data.materials,
        note_id: editData?.note_id || noteId,
        ...(!editData?.id ? { teacher_id: editData?.teacher_id } : {}),
      });
    } else {
      response = await mutateCreate({
        academic_id: editData?.academic_id || 0,
        date: dayjs(selectedDate).format("YYYY-MM-DD"),
        details: [{
          ...editData,
          subj_sched_id: editData?.subj_sched_id || 0,
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
        queryKey: ["teacher-schedules"],
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
      width={600}
    >
      <Form methods={methods} onSubmit={handleSubmit}>
        {showDetail ? (
          <>
            <div
              onClick={() => setShowDetail(false)}
              className="mb-2 transition-all duration-[400ms] flex items-center gap-1 hover:gap-3 text-primary cursor-pointer"
            >
              <BiChevronLeft className="text-2xl" />
              <p className="font-semibold text-sm">Kembali</p>
            </div>
            <div className="px-3 mt-2 font-medium text-sm flex py-2 border border-gray-300 bg-gray-100">
              <div className="w-full">Nama Siswa</div>
              <div className="w-full">Keterangan</div>
            </div>

            {editData?.absence_details?.map((student, index) => (
              <div
                key={index}
                className="px-3 font-medium text-sm flex py-2 border-b border-r border-l border-gray-300"
              >
                <div className="w-full">{student.full_name}</div>
                <div className="w-full">{student.status === "Sick" ? "Sakit" : "Izin"}</div>
              </div>
            ))}
          </>
        ) : (
          <>
            <div className="flex flex-col gap-1">
              <table className="font-medium">
                <tbody>
                  <tr>
                    <td className="pb-1.5 pr-5">Tanggal</td>
                    <td className="pb-1.5 pr-5">:</td>
                    <td className="pb-1.5 pr-5">{formatDate(selectedDate?.toString() || "")}</td>
                  </tr>
                  <tr>
                    <td className="pb-1.5 pr-5">Mulai - Selesai</td>
                    <td className="pb-1.5 pr-5">:</td>
                    <td className="pb-1.5 pr-5">{editData?.start_hour} - {editData?.end_hour}</td>
                  </tr>
                  <tr>
                    <td className="pb-1.5 pr-5">Mata Pelajaran</td>
                    <td className="pb-1.5 pr-5">:</td>
                    <td className="pb-1.5 pr-5">{editData?.subject}</td>
                  </tr>
                  <tr>
                    <td className="pb-1.5 pr-5">Guru</td>
                    <td className="pb-1.5 pr-5">:</td>
                    <td className="pb-1.5 pr-5">{editData?.teacher}</td>
                  </tr>
                </tbody>
              </table>
              <div className="w-fit min-w-xs mb-3">
                <div className="flex items-center gap-2">
                  <p className="font-medium">Siswa Yang Tidak Hadir</p>
                  <div 
                    className="cursor-pointer py-1 px-2 border font-medium text-sm rounded-lg" 
                    onClick={() => setShowDetail(true)}
                  >Lihat Detail</div>
                </div>
                <p className="text-sm font-medium">Siswa Sakit: {editData?.absence_count?.find(x => x.status === "Sick")?.total || 0}</p>
                <p className="text-sm font-medium">Siswa Izin: {editData?.absence_count?.find(x => x.status === "Permission")?.total || 0}</p>
              </div>
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
          </>
        )}
      </Form>
    </Modal>
  )
}

export default ClassNoteModal