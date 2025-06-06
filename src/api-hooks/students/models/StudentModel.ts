import { ClassModel } from "../../class/models/ClassModel";
import { DocumentModel } from "../../documents/models/DocumentModel";
import { PaginationParams } from "../../method";
import { GuardianModel } from "../../registration/models/RegistrationModel";

export type StudentModel = {
  id?: number;
  email?: string;
  applicant_id: number;
  academics?: ClassModel
  current_academic_id: number;
  user_id: number;
  profile_pic: string;
  full_name: string;
  identity_no: string;
  nis: string;
  nisn: string;
  place_of_birth: string;
  date_of_birth: string;
  address: string;
  phone: string;
  religion: string;
  child_sequence: number;
  number_of_siblings: number;
  living_with: string;
  child_status: string;
  guardians: GuardianModel[];
  documents: DocumentModel[];
  deleted_at?: string | null;
};

export type StudentParams = {
  search: string;
  pagination: PaginationParams;
};

export type UpdateStudentAcademicIdModel = {
  student_ids: number[];
  academic_id: number;
}