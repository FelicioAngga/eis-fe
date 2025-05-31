export type ConfigClassSchedModel = {
  id?: number;
  display_name?: string;
  academic_id: number;
  subject_id: number;
  subject: string;
  teacher_id: number;
  teacher: string;
  day: string;
  start_hour: string;
  end_hour: string;
  class_note_id?: number;
  materials?: string;
}

export type CreateConfigClassSchedModel = {
  academic_id: number;
  schedules: {
    day: string;
    entries: {
      subject_id: number;
      teacher_id: number;
      start_hour: string;
      end_hour: string;
    }[];
  }[];
}

export type UpdateConfigClassSchedModel = {
  academic_id: number;
  entries: {
    id: number;
    subject_id: number;
    teacher_id: number;
    day: string;
    start_hour: string;
    end_hour: string;
  }[];
}
