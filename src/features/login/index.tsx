import jumbotronLogin from "../../assets/images/jumbotron-login.png";
import { Input } from "../../components/input/Input";
import Form from "../../components/Form";
import { useForm } from "react-hook-form";
import Button from "../../components/Button";
import useYupValidationResolver from "../../hooks/useYupValidationResolver";
import * as Yup from "yup";
import { useLoginUser } from "../../api-hooks/auth/api";
import { AuthModel } from "../../api-hooks/auth/models/AuthModel";
import { useAlert } from "../../contexts/AlertContext";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";

export default function() {
	const location = useLocation();
	const params = new URLSearchParams(location.search);

	const navigate = useNavigate();
	const { isAuthenticated, onChangeAuthenticate, setUser } = useAuth();
	const { showAlert } = useAlert();
	const yupSchema = Yup.object().shape({
		email: Yup.string().email("Email tidak valid").required("Email tidak boleh kosong"),
		password: Yup.string().required("Password tidak boleh kosong")
	});

	const resolver = useYupValidationResolver(yupSchema);
	const methods = useForm({
		mode: "onSubmit",
		resolver,
		defaultValues: {
			email: "",
			password: ""
		}
	});
	const { formState: { isValid } } = methods;
	const { mutateAsync, isPending } = useLoginUser();

	const handleSubmit = async (data: AuthModel) => {
		const response = await mutateAsync(data);
		if (response.status !== 200 || !response.result) {
			showAlert({
				title: "Gagal",
				message: response?.message || "Login Gagal",
				type: "error",
			});
			return;
		}
		setUser(response.result)
		onChangeAuthenticate(response.result);
		showAlert({
			title: "Berhasil",
			message: "Login Berhasil",
			type: "success",
		});
		navigate("/");
	}

	useEffect(() => {
		if (!params.get("email") || !params.get("password")) return;
		if (isPending) return;
		handleSubmit({
			email: params.get("email") || "",
			password: params.get("password") || ""
		});
	}, [params])

	useEffect(() => {
		if (isAuthenticated) navigate("/");
	}, []);

	return (
		<Form methods={methods} onSubmit={handleSubmit}>
			<div className="flex">
				<img src={jumbotronLogin} className="w-1/2 object-cover h-screen" />
				<div className="px-4 lg:px-16 flex flex-col gap-10 justify-center items-center w-1/2">
					<p className="font-bold text-3xl">Portal Letjen Haryono M.T</p>
					<Input 
						name="email"
						type="text"
						placeholder="Email"
						label="Email"
					/>
					<Input 
						name="password"
						type="password"
						placeholder="Password"
						label="Password"
					/>
					<Button disabled={!isValid || isPending} className="w-full">Login</Button>
				</div>
			</div>
		</Form>
	);
}