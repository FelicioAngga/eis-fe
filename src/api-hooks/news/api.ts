import { useQuery } from "@tanstack/react-query";
import { useApiCall } from "../../hooks/useApiCall";
import { BASE_URL } from "../../utils/base-url";
import { ResponsePaginationModel } from "../method";
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