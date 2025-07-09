import { useMutation, useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../../utils/base-url";
import { ResponseModel, ResponsePaginationModel } from "../method";
import { useApiCall } from "../../hooks/useApiCall";
import { SubjectModel, SubjectParams } from "./models/SubjectModel";

export const useSubjectsQuery = (params?: SubjectParams) => {
  const apiCall = useApiCall<ResponsePaginationModel<SubjectModel>>({
    method: "GET",
    url: `${BASE_URL}/subjects`,
    inputOptions: {
      ...params?.pagination,
      ...(params?.search ? { search: params.search } : {}),
      ...(params?.is_extracurricular !== null ? { is_extracurricular: params?.is_extracurricular } : {}),
    }
  });

  return useQuery({
    queryKey: ["subjects", params],
    queryFn: async () => {
      return await apiCall();
    },
  });
}

export const useCreateSubject = () => {
  const apiCall = useApiCall<ResponseModel<any>>({
    method: "POST",
    url: `${BASE_URL}/subjects`,
  });

  return useMutation({
    mutationFn: async (data: { name: string, code: string; is_extracurricular: boolean }) => {
      return await apiCall({ 
        body: data
      });
    },
  });
}

export const useDeleteSubject = () => {
  const apiCall = useApiCall<ResponseModel<any>>({
    method: "DELETE",
    url: `${BASE_URL}/subjects`,
  });

  return useMutation({
    mutationFn: async (id: number) => {
      return await apiCall({ 
        url: `${BASE_URL}/subjects/${id}`,
      });
    },
  });
}