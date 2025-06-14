export type StudentGradesModel = {
  academic_id: number;
  term_id: number;
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
  first_quiz?: number;
  second_quiz?: number;
  first_month?: number;
  second_month?: number;
  finals?: number;
  remarks?: string;
}

export type StudentScoreModel = {
  subject_name: string;
  first_quiz?: number;
  second_quiz?: number;
  first_month?: number;
  second_month?: number;
  finals?: number;
}

export type StudentGradeReportParams = {
  academic_id: number;
  level_id: number;
  academic_year: string;
}

export type StudentGradeReportModel = {
  average: number;
  class: string;
  students: {
    finals: number;
    nis: string;
    rank: number;
    student: string;
    class: string;
  }[]
}