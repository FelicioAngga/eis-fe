import { Modal } from "antd"

interface ClassMarksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function ClassMarksModal({ isOpen, onClose }: ClassMarksModalProps) {

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
      title="Data Nilai"
    >
    </Modal>
  )
}

export default ClassMarksModal