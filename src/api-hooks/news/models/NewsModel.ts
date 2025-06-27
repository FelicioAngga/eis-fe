import { PaginationParams } from "../../method";

export type NewsModel = {
  id?: number;
  title: string;
  content: string;
  thumbnail: string;
  created_at?: string;
}

export type NewsParams = {
  search: string;
  pagination: PaginationParams;
}