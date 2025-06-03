export type CreateStudentGradesModel = {
  academic_id: number;
  details: CreateStudentGradesDetailModel[];
}

export type CreateStudentGradesDetailModel = {
  subject_id: number;
  students: StudentGradesEntryModel[];
}

export type StudentGradesEntryModel = {
  student_id?: number;
  quiz?: number;
  first_month?: number;
  second_month?: number;
  finals?: number;
  remarks?: string;
}