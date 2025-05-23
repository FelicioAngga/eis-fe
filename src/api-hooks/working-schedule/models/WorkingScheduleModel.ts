import { PaginationParams } from "../../method";

export type WorkingScheduleModel = {
  id: number;
  name: string;
  details: WorkingScheduleDetailModel[];
}

export type WorkingScheduleDetailModel = {
  work_sched_id: number;
  day: string;
  work_start: string;
  work_end: string;
}

export type WorkingScheduleParams = {
  search: string;
  pagination: PaginationParams;
}