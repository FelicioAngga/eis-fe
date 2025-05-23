
import { WorkingScheduleModel } from '../../../api-hooks/working-schedule/models/WorkingScheduleModel';
import { Modal } from 'antd';

interface WorkingScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  editData?: WorkingScheduleModel | null;
}

function WorkingScheduleModal({ isOpen, onClose, editData }: WorkingScheduleModalProps) {

  const handleClose = () => {
    onClose();
  }

  return (
    <Modal
      open={isOpen}
      footer={null}
      onCancel={handleClose}
      maskClosable={false}
      centered
      title={editData ? "Edit Guru" : "Tambah Guru"}
      width={600}
    >

    </Modal>
  )
}

export default WorkingScheduleModal