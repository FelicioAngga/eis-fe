import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface ClassScheduleEntry {
  subject_id: number;
  teacher_id: number;
  start_hour: string;
  end_hour: string;
}

export interface DailyClassSchedule {
  day: string;
  entries: ClassScheduleEntry[];
}

export interface ClassScheduleState {
  class_schedule_list: DailyClassSchedule[];
}
  
const initialState: ClassScheduleState = {
  class_schedule_list: [],
}

export const configClassSchedSlice = createSlice({
	name: 'configClassSched',
	initialState,
	reducers: {
		changeClassSchedByDay: (state, action: PayloadAction<DailyClassSchedule>) => {
			const classSchedule = state.class_schedule_list.find((item) => item.day === action.payload.day);
      if (classSchedule) classSchedule.entries = action.payload.entries;
		},
	},
});

export const { changeClassSchedByDay } = configClassSchedSlice.actions
export default configClassSchedSlice.reducer
