import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { ClassModel } from '../../api-hooks/class/models/ClassModel';

export interface ClassAcademicState {
  activeMenu: string;
  classDetail: ClassModel | null;
}
  
const initialState: ClassAcademicState = {
	activeMenu: '',
  classDetail: null,
}

export const classAcademicSlice = createSlice({
	name: 'classAcademic',
	initialState,
	reducers: {
		changeActiveMenu: (state, action: PayloadAction<string>) => {
			state.activeMenu = action.payload;
		},
    changeClassDetail: (state, action: PayloadAction<ClassModel>) => {
      state.classDetail = action.payload;
    }
	},
});

export const { 
  changeActiveMenu,
  changeClassDetail,
} = classAcademicSlice.actions;
export default classAcademicSlice.reducer;