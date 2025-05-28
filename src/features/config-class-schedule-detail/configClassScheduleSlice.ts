import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface ClassScheduleEntry {
  index?: number;
  subject_id: number;
  teacher_id: number;
  start_hour: string;
  end_hour: string;
}

export interface DailyClassSchedule {
  day: string;
  entries: ClassScheduleEntry[];
}

type DaysType = "senin" | "selasa" | "rabu" | "kamis" | "jumat" | "sabtu";

export interface ClassScheduleState {
  class_schedule_list: DailyClassSchedule[];
  selected_day: DaysType;
}
  
const initialState: ClassScheduleState = {
  class_schedule_list: [],
  selected_day: 'senin',
}

export const configClassSchedSlice = createSlice({
	name: 'configClassSched',
	initialState,
	reducers: {
		changeClassSchedByDay: (state, action: PayloadAction<DailyClassSchedule>) => {
			const classSchedule = state.class_schedule_list.find((item) => item.day === action.payload.day);
      if (classSchedule) classSchedule.entries = action.payload.entries;
		},
    addLessonByDay: (state) => {
      const selectedDaySchedule = state.class_schedule_list.find((item) => item.day === state.selected_day);
      if (!selectedDaySchedule) {
        state.class_schedule_list.push({
          day: state.selected_day,
          entries: [{
            index: 0,
            subject_id: 0,
            teacher_id: 0,
            start_hour: '08:00',
            end_hour: '08:00',
          }],
        });
      } else {
        selectedDaySchedule.entries.push({
          index: selectedDaySchedule.entries.length,
          subject_id: 0,
          teacher_id: 0,
          start_hour: '08:00',
          end_hour: '08:00',
        });
      }
    },
    changeSelectedDay: (state, action: PayloadAction<DaysType>) => {
      state.selected_day = action.payload;
    },
    updateStartHourByIndex: (state, action: PayloadAction<{ index: number, start_hour: string }>) => {
      const selectedDaySchedule = state.class_schedule_list.find(item => item.day === state.selected_day);
      selectedDaySchedule?.entries?.forEach((entry, idx) => {
        entry.start_hour = idx === action.payload.index ? action.payload.start_hour : entry.start_hour;
      });
    },
    updateEndHourByIndex: (state, action: PayloadAction<{ index: number, end_hour: string }>) => {
      const selectedDaySchedule = state.class_schedule_list.find(item => item.day === state.selected_day);
      selectedDaySchedule?.entries?.forEach((entry, idx) => {
        entry.end_hour = idx === action.payload.index ? action.payload.end_hour : entry.end_hour;
      });
    },
    updateSubjectIdByIndex: (state, action: PayloadAction<{ index: number, subject_id: number }>) => {
      const selectedDaySchedule = state.class_schedule_list.find(item => item.day === state.selected_day);
      selectedDaySchedule?.entries?.forEach((entry, idx) => {
        entry.subject_id = idx === action.payload.index ? action.payload.subject_id : entry.subject_id;
      });
    },
    updateTeacherIdByIndex: (state, action: PayloadAction<{ index: number, teacher_id: number }>) => {
      const selectedDaySchedule = state.class_schedule_list.find(item => item.day === state.selected_day);
      selectedDaySchedule?.entries?.forEach((entry, idx) => {
        entry.teacher_id = idx === action.payload.index ? action.payload.teacher_id : entry.teacher_id;
      });
    },
	},
});

export const { 
  changeClassSchedByDay,
  addLessonByDay,
  changeSelectedDay,
  updateStartHourByIndex,
  updateEndHourByIndex,
  updateSubjectIdByIndex,
  updateTeacherIdByIndex,
} = configClassSchedSlice.actions
export default configClassSchedSlice.reducer
