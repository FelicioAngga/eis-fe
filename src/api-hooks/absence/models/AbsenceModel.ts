import { PaginationParams } from "../../method";

export type CreateAbsenceBatchModel = {
  date: string;
}

export type UpdateAbsenceModel = {
  academic_id: number;
  date: string;
  students: StudentAbsenceModel[];
};

export type StudentAbsenceModel = {
  student_id: number;
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