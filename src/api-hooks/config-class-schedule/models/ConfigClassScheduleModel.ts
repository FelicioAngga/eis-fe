export type ConfigClassSchedModel = {
  id?: number;
  display_name?: string;
  academic_id: number;
  subject_id: number;
  teacher_id: number;
  day: string;
  start_hour: string;
  end_hour: string;
}