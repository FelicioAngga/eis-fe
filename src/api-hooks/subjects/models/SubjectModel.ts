import { PaginationParams } from "../../method";

export type SubjectParams = {
  search: string;
  pagination: PaginationParams;
}

export type SubjectModel = {
  id: number;
  name: string;
  code: string;
  description: string;
  created_at: string;
  updated_at: string;
}