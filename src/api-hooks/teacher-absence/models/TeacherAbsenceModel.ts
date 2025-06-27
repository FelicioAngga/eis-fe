import { PaginationParams } from "../../method";

export type TeacherAbsenceModel = {
  id?: number;
  date: string;
  log_in_time: string;
  log_out_time: string;
  remark?: string;
}

export type TeacherAbsenceParams = {
  search: string;
  date: string;
  userId?: number;
  pagination: PaginationParams;
}

export type TeacherAbsenceCreateModel = {
  id?: number;
  teacher_id: number;
  date: string;
  log_in_time?: string;
  log_out_time?: string;
  remark?: string;
  working_schedule_id?: number;
  note?: string;
}

export type TeacherAbsenceReportModel = {
  teacher: string;
  late: number;
  absence: number;
  early_leave: number;
  total: number;
  present: number;
}

export type TeacherAbsenceReportParams = {
  search?: string;
  start_date?: string;
  end_date?: string;
}