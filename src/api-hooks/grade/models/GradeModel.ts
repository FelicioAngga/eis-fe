import { PaginationParams } from "../../method";

export type GradeModel = {
  id?: number;
  name: string;
  currentHistory: GradeDetailModel;
  histories: GradeDetailModel[];
}

export type GradeDetailModel = {
  id?: number;
  level_id: number;
  op_cert_num: string;
  npsn: string;
  accreditation: string;
  curriculum: string;
  email: string;
  phone: string;
  principle_id?: number | null;
  operator_id?: number | null;
  state: boolean;
  created_at: string;
}

export type GradeParams = {
  search: string;
  pagination: PaginationParams;
}