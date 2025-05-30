import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface ClassScheduleEntry {
  index?: number;
  id?: number;
  subject_id: number;
  teacher_id: number;
  start_hour: string;
  end_hour: string;
}

export interface DailyClassSchedule {
  day: string;
  entries: ClassScheduleEntry[];
}

type DaysType = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday";

export interface ClassScheduleState {
  class_schedule_list: DailyClassSchedule[];
  selected_day: DaysType;
}
  
const initialState: ClassScheduleState = {
  class_schedule_list: [],
  selected_day: 'Monday',
}

export const configClassSchedSlice = createSlice({
	name: 'configClassSched',
	initialState,
	reducers: {
    resetClassSchedule: (state, action: PayloadAction<ClassScheduleState>) => {
      state.selected_day = 'Monday';
      state.class_schedule_list = action.payload.class_schedule_list || [];
    },
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
    updateStartHourByIndex: (state, action: PayloadAction<{ index?: number, id?: number, start_hour: string }>) => {
      const selectedDaySchedule = state.class_schedule_list.find(item => item.day === state.selected_day);
      selectedDaySchedule?.entries?.forEach(entry => {
        if (action.payload.index || action.payload.index === 0) entry.start_hour = entry.index === action.payload.index ? action.payload.start_hour : entry.start_hour;
        else if (action.payload.id) entry.start_hour = entry.id === action.payload.id ? action.payload.start_hour : entry.start_hour;
      });
    },
    updateEndHourByIndex: (state, action: PayloadAction<{ index?: number, id?: number, end_hour: string }>) => {
      const selectedDaySchedule = state.class_schedule_list.find(item => item.day === state.selected_day);
      selectedDaySchedule?.entries?.forEach(entry => {
        if (action.payload.index || action.payload.index === 0) entry.end_hour = entry.index === action.payload.index ? action.payload.end_hour : entry.end_hour;
        else if (action.payload.id) entry.end_hour = entry.id === action.payload.id ? action.payload.end_hour : entry.end_hour;
      });
    },
    updateSubjectIdByIndex: (state, action: PayloadAction<{ index?: number, id?: number, subject_id: number }>) => {
      const selectedDaySchedule = state.class_schedule_list.find(item => item.day === state.selected_day);
      selectedDaySchedule?.entries?.forEach(entry => {
        if (action.payload.index || action.payload.index === 0) entry.subject_id = entry.index === action.payload.index ? action.payload.subject_id : entry.subject_id;
        else if (action.payload.id) entry.subject_id = entry.id === action.payload.id ? action.payload.subject_id : entry.subject_id;
      });
    },
    updateTeacherIdByIndex: (state, action: PayloadAction<{ index?: number, id?: number, teacher_id: number }>) => {
      const selectedDaySchedule = state.class_schedule_list.find(item => item.day === state.selected_day);
      selectedDaySchedule?.entries?.forEach(entry => {
        if (action.payload.index || action.payload.index === 0) entry.teacher_id = entry.index === action.payload.index ? action.payload.teacher_id : entry.teacher_id;
        else if (action.payload.id) entry.teacher_id = entry.id === action.payload.id ? action.payload.teacher_id : entry.teacher_id;
      });
    },
    deleteLessonByIndex: (state, action: PayloadAction<{ index?: number, id?: number }>) => {
      const selectedDaySchedule = state.class_schedule_list.find(item => item.day === state.selected_day);
      if (selectedDaySchedule) {
        selectedDaySchedule.entries = selectedDaySchedule.entries.filter(entry => {
          if (action.payload.index || action.payload.index === 0) return entry.index !== action.payload.index;
          else if (action.payload.id) return entry.id !== action.payload.id;
          return true;
        });
      }
    }
	},
});

export const { 
  resetClassSchedule,
  changeClassSchedByDay,
  addLessonByDay,
  changeSelectedDay,
  updateStartHourByIndex,
  updateEndHourByIndex,
  updateSubjectIdByIndex,
  updateTeacherIdByIndex,
  deleteLessonByIndex,
} = configClassSchedSlice.actions
export default configClassSchedSlice.reducer
