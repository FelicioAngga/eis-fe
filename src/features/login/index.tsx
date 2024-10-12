import { useDispatch, useSelector } from "react-redux";
import { login } from "./authSlice";
import { RootState } from "../../store";

export default function() {
	const dispatch = useDispatch();
	const { email } = useSelector((states: RootState) => states.auth);

	return (
		<div>
			<h1>Login</h1>
			<input onClick={() => dispatch(login({ email: 'test', password: 'test' }))} type="text" placeholder="Email" />
			<input onClick={() => console.log(email)} type="text" placeholder="Password" />
			<p>{email}</p>
		</div>
	);
}