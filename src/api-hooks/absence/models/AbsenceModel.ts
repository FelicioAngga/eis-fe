import { PaginationParams } from "../../method";

export type CreateAbsenceBatchModel = {
  date: string;
}

export type UpdateAbsenceModel = {
  academic_id: number;
  term_id: number;
  date: string;
  students: StudentAbsenceModel[];
};

export type StudentAbsenceModel = {
  student_id: number;
  student?: string;
  status: "Present" | "Sick" | "Permission" | "Alpha";
  remarks?: string;
}

export type StudentAbsenceParams = {
  search: string;
  pagination: PaginationParams;
}


export type ResponseStudentAbsenceModel = {
  data: {
    students: StudentAbsenceModel[];
    date: string;
  }
}
export type StudentViewAbsenceModel = {
  month: number;
  student: string;
  academic: string;
  presence_count: number;
  sick_count: number;
  permission_count: number;
  alpha_count: number;
  details: {
    date: string;
    status: string;
    remarks?: string;
  }[];
}

export type StudentAbsenceReportModel = {
  entries: {
    student: string;
    present_count: number;
    sick_count: number;
    permission_count: number;
    alpha_count: number;
  }[];
  levels: {
    level: string;
    present_count: number;
    sick_count: number;
    permission_count: number;
    alpha_count: number;
  }[];
}

export type StudentAbsenceReportParams = {
  academic_id: string;
  level_id: string;
  search: string;
  start_date: string;
  end_date: string;
  term_id: string;
  status: string;
}