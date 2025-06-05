import { useQuery } from "@tanstack/react-query";
import { useApiCall } from "../../hooks/useApiCall";
import { BASE_URL } from "../../utils/base-url";
import { ResponsePaginationModel } from "../method";
import { AccessRightDetailModel, AccessRightModel, AccessRightParams } from "./models/AccessRightModel";

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