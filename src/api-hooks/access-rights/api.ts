import { useQuery } from "@tanstack/react-query";
import { useApiCall } from "../../hooks/useApiCall";
import { BASE_URL } from "../../utils/base-url";
import { ResponsePaginationModel } from "../method";
import { AccessRightModel, AccessRightParams } from "./models/AccessRightModel";

export const useAccessRightQuery = (params?: AccessRightParams) => {
  const apiCall = useApiCall<ResponsePaginationModel<AccessRightModel>>({
    method: "GET",
    url: `${BASE_URL}/subjects`,
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
