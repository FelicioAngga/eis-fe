import { useMutation, useQuery } from "@tanstack/react-query";
import { useApiCall } from "../../hooks/useApiCall";
import { BASE_URL } from "../../utils/base-url";
import { ResponseModel, ResponsePaginationModel } from "../method";
import { AccessRightDetailModel, AccessRightModel, AccessRightParams, AccessRightPermission, CreateAccessRightModel } from "./models/AccessRightModel";

export const useAccessRightQuery = (params?: AccessRightParams) => {
  const apiCall = useApiCall<ResponsePaginationModel<AccessRightModel>>({
    method: "GET",
    url: `${BASE_URL}/roles`,
    inputOptions: {
      ...params?.pagination,
      ...(params?.search ? { search: params.search } : {}),
    }
  });

  return useQuery({
    queryKey: ["access-rights", params],
    queryFn: async () => {
      return await apiCall();
    },
  });
}

export const useAccessRightDetail = (id: number) => {
  const apiCall = useApiCall<{ data: AccessRightDetailModel }>({
    method: "GET",
    url: `${BASE_URL}/roles/${id}`,
  });

  return useQuery({
    queryKey: ["access-right-detail", id],
    queryFn: async () => {
      return await apiCall();
    },
    enabled: !!id,
  });
}

export const useGetAllPermissions = () => {
  const apiCall = useApiCall<{ data: AccessRightPermission[] }>({
    method: "GET",
    url: `${BASE_URL}/roles/permissions`,
  });

  return useQuery({
    queryKey: ["permissions"],
    queryFn: async () => {
      return await apiCall();
    },
  });
}

export const useCreateAccessRight = () => {
  const apiCall = useApiCall<ResponseModel<any>>({
    method: "POST",
    url: `${BASE_URL}/roles`,
  });

  return useMutation({
    mutationFn: async (data: CreateAccessRightModel) => {
      return await apiCall({ 
        body: data
      });
    },
  });
}

export const useUpdateAccessRight = () => {
  const apiCall = useApiCall<ResponseModel<any>>({
    method: "PUT",
    url: `${BASE_URL}/roles`,
  });

  return useMutation({
    mutationFn: async (data: CreateAccessRightModel) => {
      return await apiCall({ 
        url: `${BASE_URL}/roles/${data.id}`,
        body: data
      });
    },
  });
}

export const useDeleteRole = () => {
  const apiCall = useApiCall<ResponseModel<any>>({
    method: "DELETE",
    url: `${BASE_URL}/roles`,
  });

  return useMutation({
    mutationFn: async (roleId: number) => {
      return await apiCall({ 
        url: `${BASE_URL}/roles/${roleId}`
      });
    },
  });
}