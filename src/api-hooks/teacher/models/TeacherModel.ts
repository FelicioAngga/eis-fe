import { PaginationParams } from "../../method";

export type TeacherModel = {
	id: number;
	user_id?: number;
  identity_no: string;
	name: string;
	nuptk: string | null;
	phone: string;
	email: string;
	address: string;
	job_title: string;
	profile_pic: string;
	role_id: number;
	level_id?: number;
	work_sched_id?: number;
	deleted_at?: string | null;
	machine_id?: number;
	user?: {
		role_id: number;
	}
}

export type TeacherParams = {
	search: string;
	pagination: PaginationParams;
}