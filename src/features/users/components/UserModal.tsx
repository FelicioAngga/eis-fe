import React, { useEffect, useMemo, useRef, useState } from 'react'
import { UserModel } from '../../../api-hooks/users/models/UserModel';
import { Modal } from 'antd';
import { FiEdit } from 'react-icons/fi';
import defaultUser from '../../../assets/images/default-user.jpeg';
import Form from '../../../components/Form';
import { useForm } from 'react-hook-form';
import useYupValidationResolver from '../../../hooks/useYupValidationResolver';
import * as Yup from 'yup';
import { Input } from '../../../components/input/Input';
import Button from '../../../components/Button';
import { useCreateUser, useUpdateUser } from '../../../api-hooks/users/api';
import { fileToBase64 } from '../../../utils/base64';
import { useAlert } from '../../../contexts/AlertContext';
import { useQueryClient } from '@tanstack/react-query';
import { useAccessRightQuery } from '../../../api-hooks/access-rights/api';
import { TranslateRoleObject } from '../../teacher/components/TeacherModal';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  editData: UserModel | null;
  setEditData: React.Dispatch<React.SetStateAction<UserModel | null>>
}

function UserModal({ isOpen, onClose, setEditData, editData }: UserModalProps) {
  const { showAlert } = useAlert();
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(editData?.profile_pic || null);
  const inputFileRef = useRef<any>(null);
  const { data: roleData } = useAccessRightQuery({ pagination: { limit: 99999 }, search: "" });

  const yupSchema = Yup.object().shape({
    email: Yup.string().email('Email tidak valid').required('Email tidak boleh kosong'),
    name: Yup.string().required('Nama tidak boleh kosong'),
    password: Yup.string(),
    role_id: Yup.string().required('Role tidak boleh kosong'),
  });

  const defaultValues = useMemo(() => {
    return {
      profile_pic: editData?.profile_pic || "",
      email: editData?.email || "",
      name: editData?.name || "",
      password: "",
      role_id: editData?.role_id || "",
    };
  }, [editData])

  const resolver = useYupValidationResolver(yupSchema);
  const methods = useForm({
    mode: "onSubmit",
    resolver,
  });

  function handleCloseModal() {
    setEditData(null);
    onClose();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setFile(file);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }

  const { mutateAsync: mutateCreate } = useCreateUser();
  const { mutateAsync: mutateUpdate } = useUpdateUser();
  
  async function handleSubmit(data: UserModel) {
    if (!editData && !data.password) {
      methods.setError("password", { type: "required", message: "Password tidak boleh kosong" });
      return;
    }

    const file64 = file ? await fileToBase64(file) : "";
    const mutateAsync = editData ? mutateUpdate : mutateCreate;
    const response = await mutateAsync({
      ...data,
      id: editData?.id || 0,
      profile_pic: file64 || "",
      role_id: parseInt(data?.role_id?.toString() || "0"),
    });
    if (response.status === 200) {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      showAlert({
        title: "Berhasil",
        type: "success",
        message: editData ? "User berhasil diperbarui" : "User berhasil ditambahkan",
      });
      onClose();
    } else {
      showAlert({
        title: "Gagal",
        type: "error",
        message: "Terjadi kesalahan saat menyimpan data user",
      });
    }
  }

  useEffect(() => {
    if (!defaultValues) return;
    const timeoutId = setTimeout(() => {
      methods.reset(defaultValues);
    })
    setPreview(defaultValues?.profile_pic || null);
    return () => clearTimeout(timeoutId);
  }, [defaultValues])

  return (
    <Modal
      open={isOpen}
      footer={null}
      onCancel={handleCloseModal}
      maskClosable={false}
      centered
      title={editData ? "Edit User" : "Tambah User"}
    >
      <Form methods={methods} onSubmit={handleSubmit}>
        <div className="relative size-20 mx-auto">
          <img src={preview || defaultUser} className="rounded-full object-cover size-20" />
          <input
            onChange={handleFileChange}
            ref={inputFileRef}
            type="file"
            className="hidden"
            multiple={false}
            accept='image/*'
          />
          <div onClick={() => inputFileRef.current.click()} className="rounded-full absolute right-0 bottom-0 bg-blue p-1 cursor-pointer">
            <FiEdit className="size-4 text-white" />
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-4">
          <Input 
            type="text"
            name="email"
            label="Email"
            placeholder='Email'
            required
          />
          <Input 
            type="text"
            name="name"
            label="Nama Lengkap"
            placeholder='Nama Lengkap'
            required
          />
          <Input 
            type="password"
            name="password"
            label="Password"
            placeholder='Password'
            required
          />
          <Input 
            type="select"
            name="role_id"
            label="Role"
            placeholder="Pilih Role"
            required
            options={roleData?.data.map(role => ({
              label: TranslateRoleObject(role.name),
              value: role?.id?.toString() || "",
            })) || []}
          />
        </div>

        <div className="flex gap-4 mt-5 w-full">
          <Button type="button" onClick={handleCloseModal} className="w-full" variant="outline">Batal</Button>
          <Button className="w-full">{editData ? "Simpan" : "Tambah"}</Button>
        </div>
      </Form>
    </Modal>
  )
}

export default UserModal