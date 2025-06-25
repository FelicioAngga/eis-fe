import { useQuery } from "@tanstack/react-query";
import { useApiCall } from "../../hooks/useApiCall";
import { BASE_URL } from "../../utils/base-url";
import { ResponsePaginationModel } from "../method";
import { CurriculumModel, CurriculumParams } from "./models/CurriculumModel";

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