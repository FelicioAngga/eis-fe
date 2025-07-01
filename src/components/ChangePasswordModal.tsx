import { useForm } from "react-hook-form";
import Button from "./Button";
import useYupValidationResolver from "../hooks/useYupValidationResolver";
import * as Yup from "yup";
import { useAlert } from "../contexts/AlertContext";
import { Modal } from "antd";
import Form from "./Form";
import { Input } from "./input/Input";
import { useChangePassword } from "../api-hooks/users/api";
import { useAuth } from "../hooks/useAuth";
import { useEffect } from "react";

interface ChangePasswordModalProps {
	isOpen: boolean;
	onClose: () => void;
}

function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
	const { getUser } = useAuth();
  const { showAlert } = useAlert();
  const yupSchema = Yup.object().shape({
		password: Yup.string().required("Password tidak boleh kosong").min(6, "Password minimal 6 karakter"),
		confirmPassword: Yup.string().required("Konfirmasi Password tidak boleh kosong").min(6, "Password minimal 6 karakter"),
	});

	const resolver = useYupValidationResolver(yupSchema);
	const methods = useForm({
		mode: "onSubmit",
		resolver,
		defaultValues: {
			password: "",
			confirmPassword: "",
		}
	});

	const { mutateAsync } = useChangePassword();
	const handleSubmit = async (data: { password: string, confirmPassword: string }) => {
		if (data.password !== data.confirmPassword) {
			methods.setError("confirmPassword", {
				message: "Konfirmasi password tidak sesuai"
			});
			return;
		}
		
		const response = await mutateAsync({ id: getUser()?.id, password: data.password })
		if (response.status === 200) {
			showAlert({
				title: "Berhasil",
				message: "Password berhasil diganti",
				type: "success",
			});
			onClose();
		} else {
				showAlert({
				title: "Gagal",
				message: response.message || "Gagal mengganti password",
				type: "error",
			});
		}
	}

	useEffect(() => {
		methods.reset({ password: "", confirmPassword: "" });
	}, [isOpen])

  return (
    <Modal
			title="Ganti Password"
			open={isOpen}
			onCancel={onClose}
			footer={null}
			centered
		>
			<Form methods={methods} onSubmit={handleSubmit}>
				<div className="flex flex-col gap-4">
					<Input
						type="password"
						name="password"
						label="Password Baru"
						placeholder="Masukkan password baru"
					/>
					<Input
						type="password"
						name="confirmPassword"
						label="Konfirmasi Password Baru"
						placeholder="Konfirmasi password baru"
					/>
				</div>

				<div className="flex gap-4 mt-6 justify-between">
					<Button onClick={onClose} className="w-full" type="button" variant="outline">Batal</Button>
					<Button className="w-full" showArrow>Ganti Password</Button>
				</div>
			</Form>
    </Modal>
  )
}

export default ChangePasswordModal;
