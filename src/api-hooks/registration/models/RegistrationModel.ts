import { DocumentModel } from "../../documents/models/DocumentModel";
import { PaginationParams } from "../../method";

export type RegistrationModel = {
  id: number;
  profile_pic: string;
	full_name: string;
	identity_no: string;
	place_of_birth: string;
	date_of_birth: string;
	address: string;
	phone: string;
	religion: string;
	child_sequence: number;
	number_of_siblings: number;
	living_with: string;
	child_status: string;
	school_origin: string;
	level_id: number;
	registration_grade: string;
	registration_major: string;
	state: string;
  created_at?: string;
  guardians: GuardianModel[];
	documents: DocumentModel[];
}

export type GuardianModel = {
	id?: number;
	student_id?: number;
  name: string;
  place_of_birth: string;
	date_of_birth: string;
	address: string;
  religion: string;
  highest_education: string;
  job: string;
  phone: string;
  relation: string;
}

export type RegistrationParams = {
  search: string;
  pagination: PaginationParams;
}