import { useMutation, useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../../utils/base-url";
import { useApiCall } from "../../hooks/useApiCall";
import { ResponseModel, ResponsePaginationModel } from "../method";
import { UserModel, UserParams } from "./models/UserModel";

export const useUserQuery = (params: UserParams) => {
  const apiCall = useApiCall<ResponsePaginationModel<UserModel>>({
    method: "GET",
    url: `${BASE_URL}/users`,
    inputOptions: {
      ...params?.pagination,
      ...(params?.search ? { search: params.search } : {}),
    }
  });

  return useQuery({
    queryKey: ["users", params],
    queryFn: async () => {
      return await apiCall();
    },
  });
}

export const useCreateUser = () => {
  const apiCall = useApiCall<ResponseModel<any>>({
    method: "POST",
    url: `${BASE_URL}/register`,
  });

  return useMutation({
    mutationFn: async (data: UserModel) => {
      return await apiCall({ 
        body: data
      });
    },
  }); 
}

export const useUpdateUser = () => {
  const apiCall = useApiCall<ResponseModel<any>>({
    method: "PUT",
    url: `${BASE_URL}/users`,
  });

  return useMutation({
    mutationFn: async (data: UserModel) => {
      return await apiCall({ 
        url: `${BASE_URL}/users/${data.id}`,
        body: data
      });
    },
  });
}

export const useUnArchiveUser = () => {
  const apiCall = useApiCall<ResponseModel<any>>({
    method: "PUT",
    url: `${BASE_URL}/users/undelete`,
  });
  return useMutation({
    mutationFn: async (id: number) => {
      return await apiCall({ 
        url: `${BASE_URL}/users/undelete/${id}`,
      });
    },
  })
}

export const useDeleteUser = () => {
  const apiCall = useApiCall<ResponseModel<any>>({
    method: "DELETE",
    url: `${BASE_URL}/users`,
  });
  return useMutation({
    mutationFn: async (id: number) => {
      return await apiCall({ 
        url: `${BASE_URL}/users/${id}`,
      });
    },
  })
}