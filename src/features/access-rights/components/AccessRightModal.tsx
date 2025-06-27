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
            <p className="font-medium">Akademik</p>
            <div className="pl-6">
              <p className="font-medium mt-2">Pengelolaan Akademik</p>
              <div className="pl-6 mt-2 flex flex-col gap-2">
                <div className="flex justify-between">
                  <p className="font-medium">Pendaftaran</p>
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
                  <p className="font-medium">Absensi Siswa</p>
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
                <div className="flex justify-between">
                  <p className="font-medium">Akademik</p>
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
                  <p className="font-medium">Catatan Kelas di menu akademik</p>
                  <div className="flex gap-3">
                    <Checkbox label="Write" 
                      checked={!!getPermissionByName("academic_classnote:write")?.name} 
                      onChange={(e) => handleCheckboxChange("academic_classnote:write", e.target.checked)}
                    />
                  </div>
                </div>
                <div className="flex justify-between">
                  <p className="font-medium">Semua Nilai di menu akademik</p>
                  <div className="flex gap-3">
                    <Checkbox label="Write" 
                      checked={!!getPermissionByName("academic_all_score:write")?.name} 
                      onChange={(e) => handleCheckboxChange("academic_all_score:write", e.target.checked)}
                    />
                  </div>
                </div>
                <div className="flex justify-between">
                  <p className="font-medium">Cetak di menu akademik</p>
                  <div className="flex gap-3">
                    <Checkbox label="Read" 
                      checked={!!getPermissionByName("academic_print:read")?.name} 
                      onChange={(e) => handleCheckboxChange("academic_print:read", e.target.checked)}
                    />
                  </div>
                </div>
                <div className="flex justify-between">
                  <p className="font-medium">Kelakuan di menu akademik</p>
                  <div className="flex gap-3">
                    <Checkbox label="Write" 
                      checked={!!getPermissionByName("academic_behaviour:write")?.name} 
                      onChange={(e) => handleCheckboxChange("academic_behaviour:write", e.target.checked)}
                    />
                  </div>
                </div>
                <div className="flex justify-between">
                  <p className="font-medium">Transfer siswa di menu akademik</p>
                  <div className="flex gap-3">
                    <Checkbox label="Write" 
                      checked={!!getPermissionByName("academic_transfer:write")?.name} 
                      onChange={(e) => handleCheckboxChange("academic_transfer:write", e.target.checked)}
                    />
                  </div>
                </div>
                <div className="flex justify-between">
                  <p className="font-medium">Catatan Kelas</p>
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
                  <p className="font-medium">Jadwal Mata Pelajaran</p>
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
              <p className="font-medium mt-2">Laporan</p>
              <div className="pl-6 mt-2 flex flex-col gap-2">
                <div className="flex justify-between">
                  <p className="font-medium">Rekap Absensi</p>
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
                  <p className="font-medium">Rekap Ujian</p>
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
              <p className="font-medium mt-2">Konfigurasi</p>
              <div className="pl-6 mt-2 flex flex-col gap-2">
                <div className="flex justify-between">
                  <p className="font-medium">Jenjang</p>
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
                  <p className="font-medium">Kelas</p>
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
                  <p className="font-medium">Mata Pelajaran</p>
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
                <div className="flex justify-between">
                  <p className="font-medium">Kurikulum</p>
                  <div className="flex gap-3">
                    <Checkbox label="Read" 
                      checked={!!getPermissionByName("curriculum:read")?.name} 
                      onChange={(e) => handleCheckboxChange("curriculum:read", e.target.checked)} 
                    />
                    <Checkbox label="Write" 
                      checked={!!getPermissionByName("curriculum:write")?.name} 
                      onChange={(e) => handleCheckboxChange("curriculum:write", e.target.checked)}
                    />
                  </div>
                </div>
                <div className="flex justify-between">
                  <p className="font-medium">Data Siswa</p>
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
              </div>
            </div>
          </div>

          <div className="mt-3">
            <p className="font-medium">Arsip</p>
            <div className="pl-6 mt-2 flex flex-col gap-2">
              <div className="flex justify-between">
                <p className="font-medium">Dokumen</p>
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
                <p className="font-medium">Tipe Dokumen</p>
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
            <p className="font-medium">Manajemen SDM</p>
            <div className="pl-6 mt-2 flex flex-col gap-2">
              <div className="flex justify-between">
                <p className="font-medium">Guru</p>
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
                <p className="font-medium">Absensi Guru</p>
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
                <p className="font-medium">Rekap Absensi Guru</p>
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
                <p className="font-medium">Jadwal Kerja</p>
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
            <p className="font-medium">Pengelolaan Berita</p>
            <div className="pl-6 mt-2 flex flex-col gap-2">
              <div className="flex justify-between">
                <p className="font-medium">Berita</p>
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
            <p className="font-medium">Pengaturan</p>
            <div className="pl-6 mt-2 flex flex-col gap-2">
              <div className="flex justify-between">
                <p className="font-medium">Akun Pengguna</p>
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
                <p className="font-medium">Hak Akses</p>
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