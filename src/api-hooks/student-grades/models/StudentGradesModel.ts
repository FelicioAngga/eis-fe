export type StudentGradesModel = {
  academic_id: number;
  term_id: number;
  details: StudentGradesDetailModel[];
  teacher_notes?: {
    id: number;
    notes: string;
    student: string;
    student_id: number;
  }[];
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
  extracurriculars: {
    name: string;
    score: string;
  }[];
  sick: number;
  permission: number;
  absent: number;
  home_room_teacher: string;
  principal: string;
  teacher_notes: string;
}

export type StudentPrintMonthlyReportModel = {
  name: string;
  nis: string;
  class: string;
  academic_year: string;
  grades: {
    subject: string;
    st_first_quiz: number;
    st_second_quiz: number;
    st_first_month: number;
    st_second_month: number;
    nd_first_quiz: number;
    nd_second_quiz: number;
    nd_first_month: number;
    nd_second_month: number;
  }[],
  home_room_teacher: string;
  st_first_behavior: string,
  st_second_behavior: string,
  st_first_craft: string,
  st_second_craft: string,
  st_first_tidiness: string,
  st_second_tidiness: string,
  st_first_extracurricular_first: string,
  st_first_extracurricular_score_first: string,
  st_first_extracurricular_second: string,
  st_first_extracurricular_score_second: string,
  st_second_extracurricular_first: string,
  st_second_extracurricular_score_first: string,
  st_second_extracurricular_second: string,
  st_second_extracurricular_score_second: string,
  st_first_notes: string,
  st_second_notes: string,
  st_first_sick: number,
  st_second_sick: number,
  st_first_permission: number,
  st_second_permission: number,
  st_first_absent: number,
  st_second_absent: number,
  nd_first_behavior: string,
  nd_second_behavior: string,
  nd_first_craft: string,
  nd_second_craft: string,
  nd_first_tidiness: string,
  nd_second_tidiness: string,
  nd_first_extracurricular_first: string,
  nd_first_extracurricular_score_first: string,
  nd_first_extracurricular_second: string,
  nd_first_extracurricular_score_second: string,
  nd_second_extracurricular_first: string,
  nd_second_extracurricular_score_first: string,
  nd_second_extracurricular_second: string,
  nd_second_extracurricular_score_second: string,
  nd_first_notes: string,
  nd_second_notes: string,
  nd_first_sick: number,
  nd_second_sick: number,
  nd_first_permission: number,
  nd_second_permission: number,
  nd_first_absent: number,
  nd_second_absent: number,
  st_first_date: string,
  st_second_date: string,
  nd_first_date: string,
  nd_second_date: string,
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