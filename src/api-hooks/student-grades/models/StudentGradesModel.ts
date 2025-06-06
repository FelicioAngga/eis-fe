export type StudentGradesModel = {
  academic_id: number;
  details: StudentGradesDetailModel[];
}

export type StudentGradesDetailModel = {
  subject_id: number;
  subject_name?: string;
  students: StudentGradesEntryModel[];
}

export type StudentGradesEntryModel = {
  id?: number;
  student_id?: number;
  student_name?: string;
  nis?: string;
  quiz?: number;
  first_month?: number;
  second_month?: number;
  finals?: number;
  remarks?: string;
}

export type StudentScoreModel = {
  subject_name: string;
  quiz?: number;
  first_month?: number;
  second_month?: number;
  finals?: number;
}