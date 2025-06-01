import { ConfigClassSchedModel } from "../../config-class-schedule/models/ConfigClassScheduleModel";
import { PaginationParams } from "../../method";
import { StudentModel } from "../../students/models/StudentModel";

export type ClassModel = {
  id?: number;
  classroom_id: number;
  major: string;
  start_year: string;
  end_year: string;
  display_name: string;
  level_name: string;
  homeroom_teacher: string;
  homeroom_teacher_id: number;
  classroom: any;
  subject_schedules: {
    day: string;
    entries: ConfigClassSchedModel[]
  }[];
  class_notes?: ClassNoteModel[];
  students?: StudentModel[];
}

export type ClassNoteModel = {
  academic_id: number;
  date: string;
  entries: {
    id?: number;
    subject_schedule_id: number;
    teacher_id: number;
    materials?: string;
    notes?: string;
    teacher: string;
  }[];
}

export type CreateClassNoteModel = {
  id?: number;
  academic_id: number;
  date: string;
  details: {
    id?: number;
    subj_sched_id: number;
    teacher_id: number;
    materials?: string;
    notes?: string;
  }[];
}

export type UpdateClassNoteModel = {
  id: number;
  subj_sched_id: number;
  teacher_id: number;
  materials?: string;
  notes?: string;
}

export type ClassParams = {
  search: string;
  pagination: PaginationParams;
}

export type AcademicBatchModel = {
  start_year: string;
  end_year: string;
}

export type CreateAcademicModel = {
  start_year: string;
  end_year: string;
  display_name: string;
  classroom_id: number;
  homeroom_teacher_id: number;
  major?: string;
}

export type ClassNoteDetailModel = {
  date: string;
  absence_count: {
    status: string;
    total: number;
  }[];
  absence_details: {
    full_name: string;
    status: string;
  }[];
}