import { Modal } from 'antd';
import Form from '../../../components/Form';
import { useForm } from 'react-hook-form';
import { Input } from '../../../components/input/Input';
import Checkbox from '../../../components/Checkbox';
import Button from '../../../components/Button';
import { useAccessRightDetail } from '../../../api-hooks/access-rights/api';
import { useEffect } from 'react';

interface AccessRightModalProps {
  isOpen: boolean;
  onClose: () => void;
  editId?: number | null;
}
function AccessRightModal({ isOpen, onClose, editId }: AccessRightModalProps) {
  const { data: accessRightDetail } = useAccessRightDetail(editId || 0);

  const methods = useForm({
    mode: 'onSubmit',
    defaultValues: {
      name: accessRightDetail?.data.name || '',
    },
  });

  useEffect(() => {
    if (!accessRightDetail) return;
    methods.reset({ name: accessRightDetail.data.name });
  }, [accessRightDetail]);

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
                <div className="flex justify-between">
                  <Checkbox label="Registration" />
                  <div className="flex gap-3">
                    <Checkbox label="Read" />
                    <Checkbox label="Write" />
                  </div>
                </div>
                <div className="flex justify-between">
                  <Checkbox label="Student Data" />
                  <div className="flex gap-3">
                    <Checkbox label="Read" />
                    <Checkbox label="Write" />
                  </div>
                </div>
                <div className="flex justify-between">
                  <Checkbox label="Absence" />
                  <div className="flex gap-3">
                    <Checkbox label="Read" />
                    <Checkbox label="Write" />
                  </div>
                </div>
              </div>
              <p className="font-medium mt-2">Curriculum</p>
              <div className="pl-6 mt-2 flex flex-col gap-2">
                <div className="flex justify-between">
                  <Checkbox label="Academic" />
                  <div className="flex gap-3">
                    <Checkbox label="Read" />
                    <Checkbox label="Write" />
                  </div>
                </div>
                <div className="flex justify-between">
                  <Checkbox label="Class Note" />
                  <div className="flex gap-3">
                    <Checkbox label="Read" />
                    <Checkbox label="Write" />
                  </div>
                </div>
                
                <Checkbox label="Class Schedule" />
              </div>
              <p className="font-medium mt-2">Reporting</p>
              <div className="pl-6 mt-2 flex flex-col gap-2">
                <div className="flex justify-between">
                  <Checkbox label="Absence Recap" />
                  <div className="flex gap-3">
                    <Checkbox label="Read" />
                    <Checkbox label="Write" />
                  </div>
                </div>
                <div className="flex justify-between">
                  <Checkbox label="Exam Recap" />
                  <div className="flex gap-3">
                    <Checkbox label="Read" />
                    <Checkbox label="Write" />
                  </div>
                </div>
              </div>
              <p className="font-medium mt-2">Configuration</p>
              <div className="pl-6 mt-2 flex flex-col gap-2">
                <div className="flex justify-between">
                  <Checkbox label="Grade" />
                  <div className="flex gap-3">
                    <Checkbox label="Read" />
                    <Checkbox label="Write" />
                  </div>
                </div>
                <div className="flex justify-between">
                  <Checkbox label="Classes" />
                  <div className="flex gap-3">
                    <Checkbox label="Read" />
                    <Checkbox label="Write" />
                  </div>
                </div>
                <div className="flex justify-between">
                  <Checkbox label="Subject" />
                  <div className="flex gap-3">
                    <Checkbox label="Read" />
                    <Checkbox label="Write" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3">
            <p className="font-medium">Archive</p>
            <div className="pl-6 mt-2 flex flex-col gap-2">
              <div className="flex justify-between">
                <Checkbox label="Document" />
                <div className="flex gap-3">
                  <Checkbox label="Read" />
                  <Checkbox label="Write" />
                </div>
              </div>
              <div className="flex justify-between">
                <Checkbox label="Document Type" />
                <div className="flex gap-3">
                  <Checkbox label="Read" />
                  <Checkbox label="Write" />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3">
            <p className="font-medium">Human Resource</p>
            <div className="pl-6 mt-2 flex flex-col gap-2">
              <div className="flex justify-between">
                <Checkbox label="Teacher" />
                <div className="flex gap-3">
                  <Checkbox label="Read" />
                  <Checkbox label="Write" />
                </div>
              </div>
              <div className="flex justify-between">
                <Checkbox label="Absence" />
                <div className="flex gap-3">
                  <Checkbox label="Read" />
                  <Checkbox label="Write" />
                </div>
              </div>
              <div className="flex justify-between">
                <Checkbox label="Absence Recap" />
                <div className="flex gap-3">
                  <Checkbox label="Read" />
                  <Checkbox label="Write" />
                </div>
              </div>
              <div className="flex justify-between">
                <Checkbox label="Working Schedule" />
                <div className="flex gap-3">
                  <Checkbox label="Read" />
                  <Checkbox label="Write" />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3">
            <p className="font-medium">Website Management</p>
            <div className="pl-6 mt-2 flex flex-col gap-2">
              <div className="flex justify-between">
                <Checkbox label="News & Event" />
                <div className="flex gap-3">
                  <Checkbox label="Read" />
                  <Checkbox label="Write" />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3">
            <p className="font-medium">Settings</p>
            <div className="pl-6 mt-2 flex flex-col gap-2">
              <div className="flex justify-between">
                <Checkbox label="Users" />
                <div className="flex gap-3">
                  <Checkbox label="Read" />
                  <Checkbox label="Write" />
                </div>
              </div>
              <div className="flex justify-between">
                <Checkbox label="Access Rights" />
                <div className="flex gap-3">
                  <Checkbox label="Read" />
                  <Checkbox label="Write" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-5 mt-5">
          <Button onClick={onClose} variant="outline" className="w-full">Batal</Button>
          <Button className="w-full">Simpan</Button>
        </div>
      </Form>
    </Modal>
  )
}

export default AccessRightModal