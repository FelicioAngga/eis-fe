import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface AuthState {
	email: string;
	password: string;
}
  
const initialState: AuthState = {
	email: '',
	password: '',
}

export const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		login: (state, action: PayloadAction<AuthState>) => {
			state.email = action.payload.email;
			state.password = action.payload.password;
		},
	},
});

export const { login } = authSlice.actions
export default authSlice.reducer