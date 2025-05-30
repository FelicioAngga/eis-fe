import { PaginationParams } from "../../method";

export type TeacherModel = {
	id: number;
  identity_no: string;
	name: string;
	nuptk: string | null;
	phone: string;
	email: string;
	address: string;
	job_title: string;
	profile_pic: string;
	level_id?: number;
	work_sched_id?: number;
	deleted_at?: string | null;
	machine_id?: number;
}

export type TeacherParams = {
	search: string;
	pagination: PaginationParams;
}