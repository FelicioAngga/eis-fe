import { PaginationParams } from "../../method";

export type DocumentTypeParams = {
  search: string;
  pagination: PaginationParams;
}

export type DocumentTypeModel = {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}