import { useMutation, useQuery } from "@tanstack/react-query";
import { useApiCall } from "../../hooks/useApiCall";
import { BASE_URL } from "../../utils/base-url";
import { ResponseModel, ResponsePaginationModel } from "../method";
import { GradeDetailModel, GradeModel, GradeParams } from "./models/GradeModel";

export const useGradeQuery = (params: GradeParams) => {
  const apiCall = useApiCall<ResponsePaginationModel<GradeModel>>({
    method: "GET",
    url: `${BASE_URL}/levels`,
    inputOptions: {
      ...params?.pagination,
      ...(params?.search ? { search: params.search } : {}),
    }
  });

  return useQuery({
    queryKey: ["levels", params],
    queryFn: async () => {
      return await apiCall();
    },
  });
}

export const useUpdateGrade = () => {
  const apiCall = useApiCall<ResponseModel<any>>({
    method: "POST",
    url: `${BASE_URL}/levelhistories`,
  });

  return useMutation({
    mutationFn: async (data: GradeDetailModel) => {
      return await apiCall({ 
        body: data
      });
    },
  });
}