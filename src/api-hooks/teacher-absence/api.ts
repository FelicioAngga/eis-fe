import { useMutation, useQuery } from "@tanstack/react-query";
import { useApiCall } from "../../hooks/useApiCall";
import { BASE_URL } from "../../utils/base-url";
import { ResponseModel, ResponsePaginationModel } from "../method";
import { TeacherAbsenceCreateModel, TeacherAbsenceModel, TeacherAbsenceParams } from "./models/TeacherAbsenceModel";

export const useTeacherAbsenceQuery = (params: TeacherAbsenceParams) => {
  const apiCall = useApiCall<ResponsePaginationModel<TeacherAbsenceModel>>({
    method: "GET",
    url: `${BASE_URL}/teachers/attendances`,
    inputOptions: {
      ...params?.pagination,
      ...(params?.search ? { search: params.search } : {}),
      ...(params?.date ? { date: params.date } : {}),
    }
  });

  return useQuery({
    queryKey: ["teacher-absences", params],
    queryFn: async () => {
      return await apiCall();
    },
  });
}

export const useCreateTeacherAbsence = () => {
  const apiCall = useApiCall<ResponseModel<any>>({
    method: "POST",
    url: `${BASE_URL}/teachers/attendances`,
  });

  return useMutation({
    mutationFn: async (data: TeacherAbsenceCreateModel) => {
      return await apiCall({ 
        body: data
      });
    },
  });
}

export const useUpdateTeacherAbsence = () => {
  const apiCall = useApiCall<ResponseModel<any>>({
    method: "PUT",
    url: `${BASE_URL}/teachers/attendances`,
  });

  return useMutation({
    mutationFn: async (data: TeacherAbsenceCreateModel) => {
      return await apiCall({ 
        url: `${BASE_URL}/teachers/attendances/${data.id}`,
        body: data
      });
    },
  });
}

export const useDeleteTeacherAbsence = () => {
  const apiCall = useApiCall<ResponseModel<any>>({
    method: "DELETE",
    url: `${BASE_URL}/teachers/attendances`,
  });

  return useMutation({
    mutationFn: async (id: number) => {
      return await apiCall({ 
        url: `${BASE_URL}/teachers/attendances/${id}`,
      });
    },
  });
}