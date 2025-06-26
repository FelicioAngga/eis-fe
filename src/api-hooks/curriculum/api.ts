import { useMutation, useQuery } from "@tanstack/react-query";
import { useApiCall } from "../../hooks/useApiCall";
import { BASE_URL } from "../../utils/base-url";
import { ResponseModel, ResponsePaginationModel } from "../method";
import { CreateCurriculumModel, CurriculumModel, CurriculumParams } from "./models/CurriculumModel";

export const useCurriculumQuery = (params?: CurriculumParams) => {
  const apiCall = useApiCall<ResponsePaginationModel<CurriculumModel>>({
    method: "GET",
    url: `${BASE_URL}/curriculums`,
    inputOptions: {
      ...params?.pagination,
      ...(params?.search ? { search: params.search } : {}),
    }
  });

  return useQuery({
    queryKey: ["curriculums", params],
    queryFn: async () => {
      return await apiCall();
    },
  });
}

export const useCurriculumDetailQuery = (id: number) => {
  const apiCall = useApiCall<{data: CurriculumModel }>({
    method: "GET",
    url: `${BASE_URL}/curriculums/${id}`,
  });

  return useQuery({
    queryKey: ["curriculums", id],
    queryFn: async () => {
      return await apiCall();
    },
    enabled: !!id,
  });
}

export const useCreateCurriculum = () => {
  const apiCall = useApiCall<ResponseModel<any>>({
    method: "POST",
    url: `${BASE_URL}/curriculums`,
  });

  return useMutation({
    mutationFn: async (data: CreateCurriculumModel) => {
      return await apiCall({ 
        body: data
      });
    },
  });
}

export const useUpdateCurriculum = () => {
  const apiCall = useApiCall<ResponseModel<any>>({
    method: "PUT",
    url: `${BASE_URL}/curriculums`,
  });

  return useMutation({
    mutationFn: async (data: CreateCurriculumModel) => {
      return await apiCall({ 
        url: `${BASE_URL}/curriculums/${data?.id}`,
        body: data
      });
    },
  });
}

export const useDeleteCurriculum = () => {
  const apiCall = useApiCall<ResponseModel<any>>({
    method: "DELETE",
    url: `${BASE_URL}/curriculums`,
  });

  return useMutation({
    mutationFn: async (id: number) => {
      return await apiCall({ 
        url: `${BASE_URL}/curriculums/${id}`,
      });
    },
  });
}

export const useUnDeleteCurriculum = () => {
  const apiCall = useApiCall<ResponseModel<any>>({
    method: "PUT",
    url: `${BASE_URL}/curriculums`,
  });

  return useMutation({
    mutationFn: async (id: number) => {
      return await apiCall({ 
        url: `${BASE_URL}/curriculums/undelete/${id}`,
      });
    },
  });
}
