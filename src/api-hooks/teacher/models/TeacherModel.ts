import { PaginationParams } from "../../method";

export type TeacherModel = {
	id: number;
  identity_no: string;
	name: string;
	nuptk: string;
	phone: string;
	email: string;
	address: string;
	job_title: string;
	profile_pic: string;
	level_id?: number;
	work_sched_id?: number;
}

export type TeacherParams = {
	search: string;
	pagination: PaginationParams;
}