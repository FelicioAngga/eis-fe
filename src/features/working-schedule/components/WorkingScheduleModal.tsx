import { WorkingScheduleModel } from "../../../api-hooks/working-schedule/models/WorkingScheduleModel";
import { Modal } from "antd";
import { Input } from "../../../components/input/Input";
import Form from "../../../components/Form";
import { useForm } from "react-hook-form";

interface WorkingScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  editData?: WorkingScheduleModel | null;
}

function WorkingScheduleModal({
  isOpen,
  onClose,
  editData,
}: WorkingScheduleModalProps) {
  const methods = useForm({});

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal
      open={isOpen}
      footer={null}
      onCancel={handleClose}
      maskClosable={false}
      centered
      title={editData ? "Edit Jadwal Kerja" : "Tambah Jadwal Kerja"}
      width={600}
    >
      <Form methods={methods} onSubmit={() => {}}>
        <Input
          type="text"
          name="name"
          label="Nama"
          placeholder="Nama Jadwal Kerja"
        />
        
        
      </Form>
    </Modal>
  );
}

export default WorkingScheduleModal;
