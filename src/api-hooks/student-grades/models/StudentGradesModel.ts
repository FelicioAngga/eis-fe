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
  final_grade?: number;
  remarks?: string;
}

export type StudentScoreModel = {
  subject_name: string;
  first_quiz?: number;
  second_quiz?: number;
  first_month?: number;
  second_month?: number;
  finals?: number;
  final_grade?: number;
}

export type StudentGradeReportParams = {
  academic_id: number;
  level_id: number;
  academic_year: string;
  term_id: number;
}

export type StudentGradeReportModel = {
  average: number;
  class: string;
  students: {
    final_grade?: number;
    finals?: number;
    nis: string;
    rank: number;
    student: string;
    class: string;
  }[]
}

export type StudentPrintReportModel = {
  name: string;
  nis: string;
  nisn: string;
  level: string;
  class: string;
  fase: string;
  term: number;
  academic_year: string;
  grades: {
    subject: string;
    finals: number;
    remarks: string;
  }[],
  sick: number;
  permission: number;
  absent: number;
  home_room_teacher: string;
  principal: string;
}

export type StudentAcademicModel = {
  id: number;
  display_name: string;
  terms: {
    id: number;
    name: string;
    display_name: string;
  }[];
}