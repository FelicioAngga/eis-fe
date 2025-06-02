import { Modal } from 'antd';
import Form from '../../../components/Form';
import { useForm } from 'react-hook-form';
import { Input } from '../../../components/input/Input';
import Checkbox from '../../../components/Checkbox';

interface AccessRightModalProps {
  isOpen: boolean;
  onClose: () => void;
}
function AccessRightModal({ isOpen, onClose }: AccessRightModalProps) {
  const methods = useForm({
    mode: 'onSubmit',
    defaultValues: {
      name: '',
    },
  });

  return (
    <Modal
      open={isOpen}
      footer={null}
      onCancel={onClose}
      maskClosable={false}
      centered
      title="Role"
    >
      <Form methods={methods} onSubmit={() => {}}>
        <Input
          name="name" 
          type="text"
          label="Nama Role"
          placeholder="Nama Role"
          className="mt-3"
        />
        
        <div className="mt-3 max-h-[500px] overflow-y-auto border border-gray-400 p-2 rounded">
          <div>
            <p className="font-medium">Academic</p>
            <div className="pl-6">
              <p className="font-medium mt-2">Student Management</p>
              <div className="pl-6 mt-2 flex flex-col gap-2">
                <Checkbox label="Registration" />
                <Checkbox label="Student Data" />
                <Checkbox label="Classes" />
                <Checkbox label="Absence" />
              </div>
              <p className="font-medium mt-2">Curriculum</p>
              <div className="pl-6 mt-2 flex flex-col gap-2">
                <Checkbox label="Subject" />
                <Checkbox label="Class Schedule" />
              </div>
              <p className="font-medium mt-2">Reporting</p>
              <div className="pl-6 mt-2 flex flex-col gap-2">
                <Checkbox label="Absence Recap" />
                <Checkbox label="Exam Recap" />
              </div>
              <p className="font-medium mt-2">Configuration</p>
              <div className="pl-6 mt-2 flex flex-col gap-2">
                <Checkbox label="Grade" />
                <Checkbox label="Classes" />
                <Checkbox label="Classes Schedule" />
              </div>
            </div>
          </div>

          <div className="mt-3">
            <p className="font-medium">Archive</p>
            <div className="pl-6 mt-2 flex flex-col gap-2">
              <Checkbox label="Document" />
              <Checkbox label="Document Type" />
            </div>
          </div>

          <div className="mt-3">
            <p className="font-medium">Human Resource</p>
            <div className="pl-6 mt-2 flex flex-col gap-2">
              <Checkbox label="Teacher" />
              <Checkbox label="Absence" />
              <Checkbox label="Absence Recap" />
              <Checkbox label="Working Schedule" />
            </div>
          </div>

          <div className="mt-3">
            <p className="font-medium">Website Management</p>
            <div className="pl-6 mt-2 flex flex-col gap-2">
              <Checkbox label="News & Event" />
            </div>
          </div>

          <div className="mt-3">
            <p className="font-medium">Settings</p>
            <div className="pl-6 mt-2 flex flex-col gap-2">
              <Checkbox label="Users" />
              <Checkbox label="Access Rights" />
            </div>
          </div>
        </div>
      </Form>
    </Modal>
  )
}

export default AccessRightModal