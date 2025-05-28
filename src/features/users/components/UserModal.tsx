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

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  editData: UserModel | null;
  setEditData: React.Dispatch<React.SetStateAction<UserModel | null>>
}

function UserModal({ isOpen, onClose, setEditData, editData }: UserModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(editData?.profile_pic || null);
  const inputFileRef = useRef<any>(null);

  const yupSchema = Yup.object().shape({
    email: Yup.string().email('Email tidak valid').required('Email tidak boleh kosong'),
    name: Yup.string().required('Nama tidak boleh kosong'),
    password: Yup.string().required('Password tidak boleh kosong'),
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

  function handleSubmit() {

  }

  useEffect(() => {
    if (!defaultValues) return;
    methods.reset(defaultValues);
    setPreview(defaultValues?.profile_pic || null);
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
            options={[
              { value: 'admin', label: 'Dummy Admin' },
              { value: 'user', label: 'Dummy User' },
            ]}  
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