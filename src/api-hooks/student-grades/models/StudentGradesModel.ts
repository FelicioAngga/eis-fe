export type StudentGradesModel = {
  academic_id: number;
  details: StudentGradesDetailModel[];
}

export type StudentGradesDetailModel = {
  subject_id: number;
  students: StudentGradesEntryModel[];
}

export type StudentGradesEntryModel = {
  id?: number;
  student_id?: number;
  quiz?: number;
  first_month?: number;
  second_month?: number;
  finals?: number;
  remarks?: string;
}