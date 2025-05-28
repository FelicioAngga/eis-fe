import { useMutation, useQuery } from "@tanstack/react-query";
import { useApiCall } from "../../hooks/useApiCall";
import { BASE_URL } from "../../utils/base-url";
import { ResponseModel, ResponsePaginationModel } from "../method";
import { AcademicBatchModel, ClassModel, ClassParams } from "./models/ClassModel";

export const useClassQuery = (params: ClassParams) => {
  const apiCall = useApiCall<ResponsePaginationModel<ClassModel>>({
    method: "GET",
    url: `${BASE_URL}/academics`,
    inputOptions: {
      ...params?.pagination,
      ...(params?.search ? { search: params.search } : {}),
    }
  });

  return useQuery({
    queryKey: ["class", params],
    queryFn: async () => {
      return await apiCall();
    },
  });
}

export const useClassDetail = (id: number) => {
  const apiCall = useApiCall<{ data: ClassModel }>({
    method: "GET",
    url: `${BASE_URL}/academics/${id}`,
  });

  return useQuery({
    queryKey: ["class", id],
    queryFn: async () => {
      return await apiCall();
    },
    enabled: !!id,
  });
}

export const useCreateAcademicBatch = () => {
  const apiCall = useApiCall<ResponseModel<any>>({
    method: "POST",
    url: `${BASE_URL}/academics/batch`,
  });

  return useMutation({
    mutationFn: async (data: AcademicBatchModel) => {
      return await apiCall({ 
        body: data
      });
    },
  });
}