import { PaginationParams } from "../../method";

export type AccessRightModel = {
  id?: number;
  name: string;
}

export type AccessRightDetailModel = {
  id: number;
  name: string;
  permissions: AccessRightPermission[];
}

export type AccessRightPermission = {
  id: number;
  name: string;
}

export type AccessRightParams = {
  search: string;
  pagination: PaginationParams;
}