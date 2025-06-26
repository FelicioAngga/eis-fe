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
  curriculum: string;
  curriculum_id: number;
  curriculum_subjects: {
    id: number;
    subject_id: number;
    subject_name: string;
  }[];
  level_id?: number;
  level_name: string;
  grade: string;
  homeroom_teacher: string;
  homeroom_teacher_id: number;
  classroom: any;
  subject_schedules: {
    day: string;
    entries: ConfigClassSchedModel[]
  }[];
  class_notes?: ClassNoteModel[];
  students?: StudentModel[];
  terms: TermsModel[];
}

export type ClassNoteModel = {
  id?: number;
  academic_id: number;
  term_id: number;
  date: string;
  entries: {
    id?: number;
    subject_schedule_id: number;
    teacher_id: number;
    materials?: string;
    notes?: string;
    teacher: string;
    teacher_act_id?: number;
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
  note_id?: number;
  subj_sched_id: number;
  teacher_id?: number;
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
  curriculum_id: number;
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
  details: {
    id: number;
    subject: string;
  }[];
}

export type UniqueSubject = {
  subject_id: number;
  subject: string;
  teacher: string;
  teacher_id: number;
}

export type TermsModel = {
  id: number;
  name: string;
  first_start_date?: string;
  first_end_date?: string;
  second_start_date?: string;
  second_end_date?: string;
}

export type UpdateAcademicStudentNoteModel = {
  id: number;
  academic_id: number;
  student_id: number;
  student_name?: string;
  first_term_notes?: string;
  second_term_notes?: string;
  is_first_term?: boolean;
}