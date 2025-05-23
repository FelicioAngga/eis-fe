import { useMutation, useQuery } from "@tanstack/react-query";
import { useApiCall } from "../../hooks/useApiCall";
import { BASE_URL } from "../../utils/base-url";
import { ResponseModel, ResponsePaginationModel } from "../method";
import { TeacherModel, TeacherParams } from "./models/TeacherModel";

export const useTeacherQuery = (params: TeacherParams) => {
  const apiCall = useApiCall<ResponsePaginationModel<TeacherModel>>({
    method: "GET",
    url: `${BASE_URL}/teachers`,
    inputOptions: {
      ...params?.pagination,
      ...(params?.search ? { search: params.search } : {}),
    }
  });

  return useQuery({
    queryKey: ["teachers", params],
    queryFn: async () => {
      return await apiCall();
    },
  });
}

export const useCreateTeacher = () => {
  const apiCall = useApiCall<ResponseModel<any>>({
    method: "POST",
    url: `${BASE_URL}/teachers`,
  });

  return useMutation({
    mutationFn: async (data: TeacherModel) => {
      return await apiCall({ 
        body: data
      });
    },
  });
}

export const useUpdateTeacher = () => {
  const apiCall = useApiCall<ResponseModel<any>>({
    method: "PUT",
    url: `${BASE_URL}/teachers`,
  });

  return useMutation({
    mutationFn: async (data: TeacherModel) => {
      return await apiCall({
        url: `${BASE_URL}/teachers/${data.id}`,
        body: data
      });
    },
  });
}

export const useDeleteTeacher = () => {
  const apiCall = useApiCall<ResponseModel<any>>({
    method: "DELETE",
    url: `${BASE_URL}/teachers`,
  });

  return useMutation({
    mutationFn: async (id: number) => {
      return await apiCall({ 
        url: `${BASE_URL}/teachers/${id}`,
      });
    },
  });
}