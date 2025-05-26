import { useMutation, useQuery } from "@tanstack/react-query";
import { useApiCall } from "../../hooks/useApiCall";
import { BASE_URL } from "../../utils/base-url";
import { ResponseModel, ResponsePaginationModel } from "../method";
import { NewsModel, NewsParams } from "./models/NewsModel";

export const useNewsQuery = (params: NewsParams) => {
  const apiCall = useApiCall<ResponsePaginationModel<NewsModel>>({
    method: "GET",
    url: `${BASE_URL}/blogs`,
    inputOptions: {
      ...params?.pagination,
      ...(params?.search ? { search: params.search } : {}),
    }
  });

  return useQuery({
    queryKey: ["blogs", params],
    queryFn: async () => {
      return await apiCall();
    },
  });
}

export const useNewsDetailQuery = (id: string) => {
  const apiCall = useApiCall<{data: NewsModel}>({
    method: "GET",
    url: `${BASE_URL}/blogs/${id}`,
  });

  return useQuery({
    queryKey: ["blogs", id],
    queryFn: async () => {
      return await apiCall();
    },
    enabled: !!id,
  });
}

export const useCreateNews = () => {
  const apiCall = useApiCall<ResponseModel<any>>({
    method: "POST",
    url: `${BASE_URL}/blogs`,
  });

  return useMutation({
    mutationFn: async (data: NewsModel) => {
      return await apiCall({ 
        body: data
      });
    },
  });
}

export const useUpdateNews = () => {
  const apiCall = useApiCall<ResponseModel<any>>({
    method: "PUT",
    url: `${BASE_URL}/blogs`,
  });

  return useMutation({
    mutationFn: async (data: NewsModel) => {
      return await apiCall({
        url: `${BASE_URL}/blogs/${data.id}`, 
        body: data,
      });
    },
  });
}

export const useDeleteNews = () => {
  const apiCall = useApiCall<ResponseModel<any>>({
    method: "DELETE",
    url: `${BASE_URL}/blogs`,
  });

  return useMutation({
    mutationFn: async (id: number) => {
      return await apiCall({
        url: `${BASE_URL}/blogs/${id}`, 
      });
    },
  });
}