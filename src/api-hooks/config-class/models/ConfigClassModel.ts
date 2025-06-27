import { GradeModel } from "../../grade/models/GradeModel";
import { PaginationParams } from "../../method";

export type ConfigClassModel = {
  id?: number;
  display_name: string;
	level_id: number;
	grade: string;
	name: string;
  level: GradeModel;
  deleted_at?: string | null;
}

export type ConfigClassParams = {
  search: string;
  pagination: PaginationParams;
}