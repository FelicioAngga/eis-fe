import { Modal } from 'antd';
import Form from '../../../components/Form';
import { useForm } from 'react-hook-form';
import { Input } from '../../../components/input/Input';
import Checkbox from '../../../components/Checkbox';
import Button from '../../../components/Button';
import { useAccessRightDetail, useCreateAccessRight, useGetAllPermissions, useUpdateAccessRight } from '../../../api-hooks/access-rights/api';
import { useEffect, useState } from 'react';
import { AccessRightPermission } from '../../../api-hooks/access-rights/models/AccessRightModel';
import useYupValidationResolver from '../../../hooks/useYupValidationResolver';
import * as Yup from 'yup';
import { useAlert } from '../../../contexts/AlertContext';
import { useQueryClient } from '@tanstack/react-query';

interface AccessRightModalProps {
  isOpen: boolean;
  onClose: () => void;
  editId?: number | null;
}
function AccessRightModal({ isOpen, onClose, editId }: AccessRightModalProps) {
  const { showAlert } = useAlert();
  const queryClient = useQueryClient();
  const { data: accessRightDetail } = useAccessRightDetail(editId || 0);
  const { data: permissionList } = useGetAllPermissions();
  const [permissionDataToSave, setPermissionDataToSave] = useState<AccessRightPermission[]>([]);

  const yupSchema = Yup.object().shape({
    name: Yup.string().required('Nama role harus diisi'),
  });
  const resolver = useYupValidationResolver(yupSchema);

  const methods = useForm({
    mode: 'onSubmit',
    defaultValues: {
      name: accessRightDetail?.data?.name || '',
    },
    resolver,
  });

  function getPermissionByName(name: string): AccessRightPermission | null {
    return permissionDataToSave.find(permission => permission.name === name) || null;
  }

  function handleCheckboxChange(permissionName: string, checked: boolean) {
    if (!permissionList) return;
    const permission = permissionList.data.find((permission: AccessRightPermission) => permission.name === permissionName);

    setPermissionDataToSave((prevPermissions: AccessRightPermission[]) => {
      const existingPermission = getPermissionByName(permissionName);
      if (checked) {
        if (existingPermission) return prevPermissions;
        else return [...prevPermissions, { id: permission?.id || 0, name: permissionName }];
      } else return prevPermissions.filter((perm: any) => perm.name !== permissionName);
    });
  }

  function handleClose() {
    onClose();
    methods.reset();
    setPermissionDataToSave([]);
  }

  const { mutateAsync: mutateCreate } = useCreateAccessRight();
  const { mutateAsync: mutateUpdate } = useUpdateAccessRight();
  async function handleSubmit(data: { name: string }) {
    const mutateAsync = editId ? mutateUpdate : mutateCreate;
    const response = await mutateAsync({
      id: editId || 0,
      name: data.name,
      permissions: permissionDataToSave.map((permission: AccessRightPermission) => permission.id),
    });
    if (response.status === 200) {
      showAlert({
        title: 'Berhasil',
        type: 'success',
        message: 'Role berhasil disimpan',
      });
      queryClient.invalidateQueries({ queryKey: ['access-rights'] });
      handleClose();
    } else {
      showAlert({
        title: 'Gagal',
        type: 'error',
        message: response.message || 'Gagal menyimpan role',
      });
    }
  }

  useEffect(() => {
    methods.reset({ name: accessRightDetail?.data.name || "" });
    setPermissionDataToSave(accessRightDetail?.data.permissions || []);
  }, [accessRightDetail, isOpen]);

  return (
    <Modal
      open={isOpen}
      footer={null}
      onCancel={handleClose}
      maskClosable={false}
      centered
      title="Role"
    >
      <Form methods={methods} onSubmit={handleSubmit}>
        <Input
          name="name" 
          type="text"
          label="Nama Role"
          placeholder="Nama Role"
        />
        
        <div className="mt-3 max-h-[500px] overflow-y-auto border border-gray-400 p-2 rounded">
          <div>
            <p className="font-medium">Academic</p>
            <div className="pl-6">
              <p className="font-medium mt-2">Student Management</p>
              <div className="pl-6 mt-2 flex flex-col gap-2">
                <div className="flex justify-between">
                  <p className="font-medium">Registration</p>
                  <div className="flex gap-3">
                    <Checkbox label="Read" 
                      checked={!!getPermissionByName("registration:read")?.name} 
                      onChange={(e) => handleCheckboxChange("registration:read", e.target.checked)} 
                    />
                    <Checkbox label="Write" 
                      checked={!!getPermissionByName("registration:write")?.name} 
                      onChange={(e) => handleCheckboxChange("registration:write", e.target.checked)} 
                    />
                  </div>
                </div>
                <div className="flex justify-between">
                  <p className="font-medium">Student Data</p>
                  <div className="flex gap-3">
                    <Checkbox label="Read" 
                      checked={!!getPermissionByName("student:read")?.name} 
                      onChange={(e) => handleCheckboxChange("student:read", e.target.checked)} 
                    />
                    <Checkbox label="Write" 
                      checked={!!getPermissionByName("student:write")?.name} 
                      onChange={(e) => handleCheckboxChange("student:write", e.target.checked)}
                    />
                  </div>
                </div>
                <div className="flex justify-between">
                  <p className="font-medium">Absence</p>
                  <div className="flex gap-3">
                    <Checkbox label="Read" 
                      checked={!!getPermissionByName("studentatt:read")?.name} 
                      onChange={(e) => handleCheckboxChange("studentatt:read", e.target.checked)} 
                    />
                    <Checkbox label="Write" 
                      checked={!!getPermissionByName("studentatt:write")?.name} 
                      onChange={(e) => handleCheckboxChange("studentatt:write", e.target.checked)}
                    />
                  </div>
                </div>
              </div>
              <p className="font-medium mt-2">Curriculum</p>
              <div className="pl-6 mt-2 flex flex-col gap-2">
                <div className="flex justify-between">
                  <p className="font-medium">Academic</p>
                  <div className="flex gap-3">
                    <Checkbox label="Read" 
                      checked={!!getPermissionByName("academic:read")?.name} 
                      onChange={(e) => handleCheckboxChange("academic:read", e.target.checked)} 
                    />
                    <Checkbox label="Write" 
                      checked={!!getPermissionByName("academic:write")?.name} 
                      onChange={(e) => handleCheckboxChange("academic:write", e.target.checked)}
                    />
                  </div>
                </div>
                <div className="flex justify-between">
                  <p className="font-medium">Class Note</p>
                  <div className="flex gap-3">
                    <Checkbox label="Read" 
                      checked={!!getPermissionByName("classnote:read")?.name} 
                      onChange={(e) => handleCheckboxChange("classnote:read", e.target.checked)} 
                    />
                    <Checkbox label="Write" 
                      checked={!!getPermissionByName("classnote:write")?.name} 
                      onChange={(e) => handleCheckboxChange("classnote:write", e.target.checked)}
                    />
                  </div>
                </div>
                <div className="flex justify-between">
                  <p className="font-medium">Class Schedule</p>
                  <div className="flex gap-3">
                    <Checkbox label="Read" 
                      checked={!!getPermissionByName("subjsched:read")?.name} 
                      onChange={(e) => handleCheckboxChange("subjsched:read", e.target.checked)} 
                    />
                    <Checkbox label="Write" 
                      checked={!!getPermissionByName("subjsched:write")?.name} 
                      onChange={(e) => handleCheckboxChange("subjsched:write", e.target.checked)}
                    />
                  </div>
                </div>
              </div>
              <p className="font-medium mt-2">Reporting</p>
              <div className="pl-6 mt-2 flex flex-col gap-2">
                <div className="flex justify-between">
                  <p className="font-medium">Absence Recap</p>
                  <div className="flex gap-3">
                    <Checkbox label="Read" 
                      checked={!!getPermissionByName("studentattrep:read")?.name} 
                      onChange={(e) => handleCheckboxChange("studentattrep:read", e.target.checked)} 
                    />
                    <Checkbox label="Write" 
                      checked={!!getPermissionByName("studentattrep:write")?.name} 
                      onChange={(e) => handleCheckboxChange("studentattrep:write", e.target.checked)}
                    />
                  </div>
                </div>
                <div className="flex justify-between">
                  <p className="font-medium">Exam Recap</p>
                  <div className="flex gap-3">
                    <Checkbox label="Read" 
                      checked={!!getPermissionByName("examrecap:read")?.name} 
                      onChange={(e) => handleCheckboxChange("examrecap:read", e.target.checked)} 
                    />
                    <Checkbox label="Write" 
                      checked={!!getPermissionByName("examrecap:write")?.name} 
                      onChange={(e) => handleCheckboxChange("examrecap:write", e.target.checked)}
                    />
                  </div>
                </div>
              </div>
              <p className="font-medium mt-2">Configuration</p>
              <div className="pl-6 mt-2 flex flex-col gap-2">
                <div className="flex justify-between">
                  <p className="font-medium">Grade</p>
                  <div className="flex gap-3">
                    <Checkbox label="Read" 
                      checked={!!getPermissionByName("grade:read")?.name} 
                      onChange={(e) => handleCheckboxChange("grade:read", e.target.checked)} 
                    />
                    <Checkbox label="Write" 
                      checked={!!getPermissionByName("grade:write")?.name} 
                      onChange={(e) => handleCheckboxChange("grade:write", e.target.checked)}
                    />
                  </div>
                </div>
                <div className="flex justify-between">
                  <p className="font-medium">Classes</p>
                  <div className="flex gap-3">
                    <Checkbox label="Read" 
                      checked={!!getPermissionByName("class:read")?.name} 
                      onChange={(e) => handleCheckboxChange("class:read", e.target.checked)} 
                    />
                    <Checkbox label="Write" 
                      checked={!!getPermissionByName("class:write")?.name} 
                      onChange={(e) => handleCheckboxChange("class:write", e.target.checked)}
                    />
                  </div>
                </div>
                <div className="flex justify-between">
                  <p className="font-medium">Subject</p>
                  <div className="flex gap-3">
                    <Checkbox label="Read" 
                      checked={!!getPermissionByName("subject:read")?.name} 
                      onChange={(e) => handleCheckboxChange("subject:read", e.target.checked)} 
                    />
                    <Checkbox label="Write" 
                      checked={!!getPermissionByName("subject:write")?.name} 
                      onChange={(e) => handleCheckboxChange("subject:write", e.target.checked)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3">
            <p className="font-medium">Archive</p>
            <div className="pl-6 mt-2 flex flex-col gap-2">
              <div className="flex justify-between">
                <p className="font-medium">Document</p>
                <div className="flex gap-3">
                  <Checkbox label="Read" 
                    checked={!!getPermissionByName("document:read")?.name} 
                    onChange={(e) => handleCheckboxChange("document:read", e.target.checked)} 
                  />
                  <Checkbox label="Write" 
                    checked={!!getPermissionByName("document:write")?.name} 
                    onChange={(e) => handleCheckboxChange("document:write", e.target.checked)}
                  />
                </div>
              </div>
              <div className="flex justify-between">
                <p className="font-medium">Document Type</p>
                <div className="flex gap-3">
                  <Checkbox label="Read" 
                    checked={!!getPermissionByName("doctype:read")?.name} 
                    onChange={(e) => handleCheckboxChange("doctype:read", e.target.checked)} 
                  />
                  <Checkbox label="Write" 
                    checked={!!getPermissionByName("doctype:write")?.name} 
                    onChange={(e) => handleCheckboxChange("doctype:write", e.target.checked)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3">
            <p className="font-medium">Human Resource</p>
            <div className="pl-6 mt-2 flex flex-col gap-2">
              <div className="flex justify-between">
                <p className="font-medium">Teacher</p>
                <div className="flex gap-3">
                  <Checkbox label="Read" 
                    checked={!!getPermissionByName("teacher:read")?.name} 
                    onChange={(e) => handleCheckboxChange("teacher:read", e.target.checked)} 
                  />
                  <Checkbox label="Write" 
                    checked={!!getPermissionByName("teacher:write")?.name} 
                    onChange={(e) => handleCheckboxChange("teacher:write", e.target.checked)}
                  />
                </div>
              </div>
              <div className="flex justify-between">
                <p className="font-medium">Absence</p>
                <div className="flex gap-3">
                  <Checkbox label="Read" 
                    checked={!!getPermissionByName("teacheratt:read")?.name} 
                    onChange={(e) => handleCheckboxChange("teacheratt:read", e.target.checked)} 
                  />
                  <Checkbox label="Write" 
                    checked={!!getPermissionByName("teacheratt:write")?.name} 
                    onChange={(e) => handleCheckboxChange("teacheratt:write", e.target.checked)}
                  />
                </div>
              </div>
              <div className="flex justify-between">
                <p className="font-medium">Absence Recap</p>
                <div className="flex gap-3">
                  <Checkbox label="Read" 
                      checked={!!getPermissionByName("teacherattrep:read")?.name} 
                      onChange={(e) => handleCheckboxChange("teacherattrep:read", e.target.checked)} 
                    />
                    <Checkbox label="Write" 
                      checked={!!getPermissionByName("teacherattrep:write")?.name} 
                      onChange={(e) => handleCheckboxChange("teacherattrep:write", e.target.checked)}
                    />
                </div>
              </div>
              <div className="flex justify-between">
                <p className="font-medium">Working Schedule</p>
                <div className="flex gap-3">
                  <Checkbox label="Read" 
                      checked={!!getPermissionByName("worksched:read")?.name} 
                      onChange={(e) => handleCheckboxChange("worksched:read", e.target.checked)} 
                    />
                    <Checkbox label="Write" 
                      checked={!!getPermissionByName("worksched:write")?.name} 
                      onChange={(e) => handleCheckboxChange("worksched:write", e.target.checked)}
                    />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3">
            <p className="font-medium">Website Management</p>
            <div className="pl-6 mt-2 flex flex-col gap-2">
              <div className="flex justify-between">
                <p className="font-medium">News & Event</p>
                <div className="flex gap-3">
                  <Checkbox label="Read" 
                      checked={!!getPermissionByName("news:read")?.name} 
                      onChange={(e) => handleCheckboxChange("news:read", e.target.checked)} 
                    />
                    <Checkbox label="Write" 
                      checked={!!getPermissionByName("news:write")?.name} 
                      onChange={(e) => handleCheckboxChange("news:write", e.target.checked)}
                    />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3">
            <p className="font-medium">Settings</p>
            <div className="pl-6 mt-2 flex flex-col gap-2">
              <div className="flex justify-between">
                <p className="font-medium">Users</p>
                <div className="flex gap-3">
                  <Checkbox label="Read" 
                      checked={!!getPermissionByName("users:read")?.name} 
                      onChange={(e) => handleCheckboxChange("users:read", e.target.checked)} 
                    />
                    <Checkbox label="Write" 
                      checked={!!getPermissionByName("users:write")?.name} 
                      onChange={(e) => handleCheckboxChange("users:write", e.target.checked)}
                    />
                </div>
              </div>
              <div className="flex justify-between">
                <p className="font-medium">Access Rights</p>
                <div className="flex gap-3">
                  <Checkbox label="Read" 
                      checked={!!getPermissionByName("accessrights:read")?.name} 
                      onChange={(e) => handleCheckboxChange("accessrights:read", e.target.checked)} 
                    />
                    <Checkbox label="Write" 
                      checked={!!getPermissionByName("accessrights:write")?.name} 
                      onChange={(e) => handleCheckboxChange("accessrights:write", e.target.checked)}
                    />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-5 mt-5">
          <Button onClick={handleClose} variant="outline" type="button" className="w-full">Batal</Button>
          <Button className="w-full">Simpan</Button>
        </div>
      </Form>
    </Modal>
  )
}

export default AccessRightModal