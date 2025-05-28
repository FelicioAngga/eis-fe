import { PaginationParams } from "../../method";

export type ClassModel = {
  id?: number;
  classroom_id: number;
  major: string;
  start_year: string;
  end_year: string;
  display_name: string;
  homeroom_teacher: any;
  classroom: any;
}

export type ClassParams = {
  search: string;
  pagination: PaginationParams;
}

export type AcademicBatchModel = {
  start_year: string;
  end_year: string;
}