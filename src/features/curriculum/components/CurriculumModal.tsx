import { Modal } from 'antd';

interface CurriculumModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function CurriculumModal({ isOpen, onClose }: CurriculumModalProps) {
  return (
    <Modal
      open={isOpen}
      footer={null}
      onCancel={onClose}
      maskClosable={false}
      centered
      title="Tambah Mata Pelajaran"
    >
      
    </Modal>
  )
}

export default CurriculumModal;
