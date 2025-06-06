export type ClassNoteModel = {
  id?: number;
  academic_id: number;
  subj_sched_id: number;
  class: string;
  date: string;
  day: string;
  start_hour: string;
  end_hour: string;
  materials: string;
  note_id: number;
  teacher_id: number;
  teacher_act_id?: number;
  teacher: string;
  subject: string;
  absence_count: {
    total: number;
    status: string;
  }[];
  absence_details: {
    full_name: string;
    status: string;
  }[];
}