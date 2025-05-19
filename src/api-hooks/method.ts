const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer `,
};

export const methods = [
  {
    method: "GET",
    headers: {
      ...headers,
    },
  },
  {
    method: "POST",
    headers: {
      ...headers,
    },
  },
];

export type MutationResultModel = {
  message: string;
  result: string[] | null
  status: number;
  title: string
}


export type DetailResultModel<T> = {
  message: string;
  result: T
  status: number;
  title: string
}


export type SearchModel<T> = {
  message: string;
  result: T[]
  status: number;
  title: string
}

export type ResponseModel<T> = {
  message: string;
  error?: string;
  result: T;
  status: number;
}

export type ResponsePaginationModel<T> = {
  data: T[];
  limit: number;
  page: number;
  total: number;
}

export type PaginationParams = {
  sortColumn? : string
  sortOrder?: string
  page?: number
  limit?: number
}
