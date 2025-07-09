import { PaginationParams } from "../../method";

export type SubjectParams = {
  search: string;
  is_extracurricular: boolean | null;
  pagination: PaginationParams;
}

export type SubjectModel = {
  id: number;
  name: string;
  description: string;
  is_extracurricular: boolean;
  created_at: string;
  updated_at: string;
}