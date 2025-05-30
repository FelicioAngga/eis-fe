import { useState, useEffect } from "react";
import { Modal } from "antd";
import { Input } from "../../../components/input/Input";
import Form from "../../../components/Form";
import { useForm, SubmitHandler } from "react-hook-form";
import { MdClose as MdCloseIcon } from "react-icons/md";
import { BiPlus } from "react-icons/bi";
import Button from "../../../components/Button";
import { CustomTimeInput } from "../../../components/input/CustomInputTime";
import { WorkingScheduleModel } from "../../../api-hooks/working-schedule/models/WorkingScheduleModel";
import { useCreateWorkingSchedule, useUpdateWorkingSchedule } from "../../../api-hooks/working-schedule/api";
import { useAlert } from "../../../contexts/AlertContext";
import * as Yup from 'yup';
import useYupValidationResolver from "../../../hooks/useYupValidationResolver";
import { useQueryClient } from "@tanstack/react-query";

interface WorkingScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  editData?: WorkingScheduleModel | null;
  setEditData: React.Dispatch<React.SetStateAction<WorkingScheduleModel | null>>
}

interface ScheduleRow {
  id: string; // For unique key in map
  day: string;
  masuk: string;
  keluar: string;
}

const allDaysOfWeek = [
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
  "Minggu",
];

const getFirstAvailableDay = (selectedDays: string[]): string => {
  return (
    allDaysOfWeek.find((day) => !selectedDays.includes(day)) || allDaysOfWeek[0]
  );
};

function WorkingScheduleModal({
  isOpen,
  onClose,
  editData,
  setEditData,
}: WorkingScheduleModalProps) {
  const { showAlert } = useAlert();
  const queryClient = useQueryClient();

  const formSchema = Yup.object().shape({
    name: Yup.string().required("Nama jadwal kerja wajib diisi"),
  });
  const resolver = useYupValidationResolver(formSchema);
  const defaultValues = { name: editData?.name || "" };
  const methods = useForm({
    mode: "onSubmit",
    resolver,
    defaultValues,
  });

  const {
    reset: resetHookForm,
  } = methods;

  const [scheduleRows, setScheduleRows] = useState<ScheduleRow[]>([]);

  const handleCloseModal = () => {
    setEditData(null);
    resetHookForm({ name: "" });
    setScheduleRows([
      {
        id: `default-${Date.now()}`,
        day: getFirstAvailableDay([]),
        masuk: "07:00",
        keluar: "13:00",
      },
    ]);
    onClose();
  };

  const handleScheduleChange = (
    index: number,
    field: keyof ScheduleRow,
    value: string
  ) => {
    const newRows = [...scheduleRows];
    if (newRows[index]) {
      (newRows[index] as any)[field] = value;
      setScheduleRows(newRows);
    }
  };

  const addScheduleRow = () => {
    if (scheduleRows.length < allDaysOfWeek.length) {
      const selectedDays = scheduleRows.map((r) => r.day);
      setScheduleRows([
        ...scheduleRows,
        {
          id: `schedule-${scheduleRows.length}-${Date.now()}`,
          day: getFirstAvailableDay(selectedDays),
          masuk: "07:00",
          keluar: "13:00",
        },
      ]);
    }
  };

  const removeScheduleRow = (idToRemove: string) => {
    if (scheduleRows.length > 1) setScheduleRows(scheduleRows.filter((row) => row.id !== idToRemove));
  };

  const { mutateAsync, isPending } = editData ? useUpdateWorkingSchedule() : useCreateWorkingSchedule();

  const onFinalSubmit: SubmitHandler<{ name: string }> = async (hookFormData) => {
    const combinedData: WorkingScheduleModel = {
      name: hookFormData.name,
      details: scheduleRows.map((row) => ({
        day: row.day,
        work_start: row.masuk,
        work_end: row.keluar,
      })),
      ...(editData?.id && { id: editData.id }),
    };
    
    const response = await mutateAsync(combinedData);
    if (response.status === 200) {
      showAlert({
        type: "success",
        title: "Berhasil",
        message: editData ? "Berhasil memperbarui jadwal kerja" : "Berhasil menambahkan jadwal kerja",
      })
      queryClient.invalidateQueries({
        queryKey: ["workscheds"],
      });
      handleCloseModal();
    } else {
      showAlert({
        type: "error",
        title: "Gagal",
        message: response.message || "Gagal menyimpan data",
      });
    }
  };

  useEffect(() => {
    if (editData) {
      methods.reset({ name: editData.name });
      setScheduleRows(
        editData.details.map((s, index) => ({
          id: `schedule-${index}-${Date.now()}`,
          day: s.day,
          masuk: s.work_start,
          keluar: s.work_end,
        }))
      );
    } else {
      methods.reset({ name: "" });
      setScheduleRows([
        {
          id: `schedule-0-${Date.now()}`,
          day: getFirstAvailableDay([]),
          masuk: "07:00",
          keluar: "13:00",
        },
      ]);
    }
  }, [editData]);

  const currentSelectedDays = scheduleRows.map((r) => r.day);
  return (
    <Modal
      open={isOpen}
      footer={null}
      onCancel={handleCloseModal}
      maskClosable={false}
      centered
      title={editData ? "Edit Jadwal Kerja" : "Tambah Jadwal Kerja"}
      width={700}
    >
      <Form methods={methods} onSubmit={onFinalSubmit}>
        <Input
          type="text"
          name="name"
          label="Nama"
          placeholder="Nama Jadwal Kerja"
          required
        />

        <p className="mt-5 font-medium text-sm">Jadwal</p>
        <div className="border border-gray-300 mt-2 p-3 rounded-md space-y-3">
          <div className="flex items-center border-b-2 border-b-gray-300 pb-2 space-x-2">
            <div className="w-1/12"></div>
            <div className="w-4/12  font-semibold text-xs text-gray-600">
              Hari
            </div>
            <div className="w-3/12  font-semibold text-xs text-gray-600">
              Masuk
            </div>
            <div className="w-3/12  font-semibold text-xs text-gray-600">
              Keluar
            </div>
          </div>

          {scheduleRows.map((row, index) => {
            const availableDaysForThisRow = allDaysOfWeek.filter(
              (day) =>
                day === row.day ||
                !currentSelectedDays.includes(day) ||
                currentSelectedDays[index] === day
            );
            return (
              <div key={row.id} className="flex items-center space-x-2">
                <div className="w-1/12 flex justify-center">
                  {scheduleRows.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeScheduleRow(row.id)}
                      className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                    >
                      <MdCloseIcon size={18} />
                    </button>
                  )}
                </div>
                <div className="w-4/12 relative">
                  <select
                    value={row.day}
                    onChange={(e) => handleScheduleChange(index, 'day', e.target.value)}
                    className="w-full appearance-none px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-gray-900"
                  >
                    {availableDaysForThisRow.map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
                <div className="w-3/12">
                  <CustomTimeInput
                    value={row.masuk}
                    onChange={(e) =>
                      handleScheduleChange(index, "masuk", e.currentTarget.value)
                    }
                  />
                </div>
                <div className="w-3/12">
                  <CustomTimeInput
                    value={row.keluar}
                    onChange={(e) =>
                      handleScheduleChange(index, "keluar", e.currentTarget.value)
                    }
                  />
                </div>
              </div>
            );
          })}
        </div>

        {scheduleRows.length < allDaysOfWeek.length && (
          <button
            type="button"
            onClick={addScheduleRow}
            className="mt-3 border border-blue w-fit px-2 py-1.5 rounded text-sm text-blue hover:text-blue-800 flex items-center cursor-pointer"
          >
            <BiPlus />
            Tambah Jadwal
          </button>
        )}

        <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-300">
          <Button
            type="button"
            variant="outline"
            onClick={handleCloseModal}
          >
            Batal
          </Button>
          <Button disabled={isPending}>
            {editData ? "Simpan Perubahan" : "Simpan"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
}

export default WorkingScheduleModal;
