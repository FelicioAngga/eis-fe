import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../../utils/base-url";
import { useApiCall } from "../../hooks/useApiCall";
import { ResponsePaginationModel } from "../method";
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

}
