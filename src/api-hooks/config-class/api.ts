import { useMutation, useQuery } from "@tanstack/react-query";
import { useApiCall } from "../../hooks/useApiCall";
import { BASE_URL } from "../../utils/base-url";
import { ResponseModel, ResponsePaginationModel } from "../method";
import { ConfigClassModel, ConfigClassParams } from "./models/ConfigClassModel";

export const useConfigClassQuery = (params?: ConfigClassParams) => {
  const apiCall = useApiCall<ResponsePaginationModel<ConfigClassModel>>({
    method: "GET",
    url: `${BASE_URL}/classrooms`,
    inputOptions: {
      ...params?.pagination,
      ...(params?.search ? { search: params.search } : {}),
    }
  });

  return useQuery({
    queryKey: ["classrooms", params],
    queryFn: async () => {
      return await apiCall();
    },
  });
}

export const useCreateConfigClass = () => {
  const apiCall = useApiCall<ResponseModel<any>>({
    method: "POST",
    url: `${BASE_URL}/classrooms`,
  });

  return useMutation({
    mutationFn: async (data: ConfigClassModel) => {
      return await apiCall({ 
        body: data
      });
    },
  });
}

export const useUpdateConfigClass = () => {
  const apiCall = useApiCall<ResponseModel<any>>({
    method: "PUT",
    url: `${BASE_URL}/classrooms`,
  });

  return useMutation({
    mutationFn: async (data: ConfigClassModel) => {
      return await apiCall({ 
        url: `${BASE_URL}/classrooms/${data.id}`,
        body: data
      });
    },
  });
}

export const useDeleteConfigClass = () => {
  const apiCall = useApiCall<ResponseModel<any>>({
    method: "DELETE",
    url: `${BASE_URL}/classrooms`,
  });

  return useMutation({
    mutationFn: async (id: number) => {
      return await apiCall({ 
        url: `${BASE_URL}/classrooms/${id}`,
      });
    },
  });
}