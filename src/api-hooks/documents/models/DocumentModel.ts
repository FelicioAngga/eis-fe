import { PaginationParams } from "../../method";

export type DocumentParams = {
  search: string;
  pagination: PaginationParams;
}

export type DocumentModel = {
  id: number;
  type_id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  uploaded_file: File | string;
}

export type DocumentCreateModel = {
  id: number;
  type_id: number;
  applicant_id?: number;
  name: string;
  description: string;
  uploaded_file: File | string;
}