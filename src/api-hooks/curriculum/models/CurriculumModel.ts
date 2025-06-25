import { PaginationParams } from "../../method";

export type CurriculumModel = {
  id: number;
  display_name: string;
  name: string;
  level_id: number;
  level: string;
  grade: string;
  curriculum_subjects: CurriculumSubjectModel[];
}

export type CreateCurriculumModel = {
  name: string;
  level_id: number;
  grade: string;
  curriculum_subjects: CurriculumSubjectModel[];
}

export type CurriculumSubjectModel = {
  id: number;
  subject?: string;
  subject_id: number;
  competence: string;
}

export type CurriculumParams = {
  search: string;
  pagination: PaginationParams;
}