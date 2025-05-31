import { configureStore } from '@reduxjs/toolkit'
import authReducer from './features/login/authSlice'
import configClassSchedReducer from './features/config-class-schedule-detail/configClassScheduleSlice'
import classAcademicReducer from './features/class-academic-detail/classAcademicSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    configClassSched: configClassSchedReducer,
    classAcademic: classAcademicReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch