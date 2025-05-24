import { useMutation, useQuery } from "@tanstack/react-query";
import { useApiCall } from "../../hooks/useApiCall";
import { BASE_URL } from "../../utils/base-url";
import { ResponseModel, ResponsePaginationModel } from "../method";
import { RegistrationModel, RegistrationParams } from "./models/RegistrationModel";

export const useRegistrationQuery = (params: RegistrationParams) => {
  const apiCall = useApiCall<ResponsePaginationModel<RegistrationModel>>({
    method: "GET",
    url: `${BASE_URL}/applicants`,
    inputOptions: {
      ...params?.pagination,
      ...(params?.search ? { search: params.search } : {}),
    }
  });

  return useQuery({
    queryKey: ["applicants", params],
    queryFn: async () => {
      return await apiCall();
    },
  });
}

export const useMarkRegistration = () => {
  const apiCall = useApiCall<ResponseModel<any>>({
    method: "POST",
    url: `${BASE_URL}/approve`,
  });

  return useMutation({
    mutationFn: async (id: number) => {
      return await apiCall({ 
        url: `${BASE_URL}/applicants/approve/${id}`,
      });
    },
  });
}