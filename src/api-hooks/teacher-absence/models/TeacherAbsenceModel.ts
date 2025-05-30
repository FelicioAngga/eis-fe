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
  pagination: PaginationParams;
}

export type TeacherAbsenceCreateModel = {
  id?: number;
  teacher_id: number;
  date: string;
  log_in_time: string;
  log_out_time: string;
  remark?: string;
  working_schedule_id: number;
}