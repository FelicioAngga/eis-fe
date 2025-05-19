import { useDispatch, useSelector } from "react-redux";
import { login } from "./authSlice";
import { RootState } from "../../store";
import jumbotronLogin from "../../assets/images/jumbotron-login.png";
import { Input } from "../../components/input/Input";
import Form from "../../components/Form";
import { useForm } from "react-hook-form";
import Button from "../../components/Button";

export default function() {
	const dispatch = useDispatch();
	const { email } = useSelector((states: RootState) => states.auth);
	const methods = useForm();

	const handleSubmit = (data: any) => {
		
	}

	return (
		<Form methods={methods} onSubmit={handleSubmit}>
			<div className="flex">
				<img src={jumbotronLogin} className="w-1/2 h-screen object-cover" />
				<div className="px-4 lg:px-16 flex flex-col gap-10 justify-center items-center w-1/2 h-screen">
					<p className="font-bold text-3xl">Portal Guru Letjend Haryono M.T</p>
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
					<Button className="w-full">Login</Button>
				</div>
			</div>
		</Form>
	);
}