import { PaginationParams } from "../../method";

export type UserModel = {
  id: number;
	profile_pic: string;
	name: string;
	email: string;
	password: string;
	role_id: number;
	created_at: string;
	updated_at: string;
	deleted_at: string;
}

export type UserParams = {
  search: string;
  pagination: PaginationParams;
}