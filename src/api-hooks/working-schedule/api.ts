import { useMutation, useQuery } from "@tanstack/react-query";
import { useApiCall } from "../../hooks/useApiCall";
import { BASE_URL } from "../../utils/base-url";
import { ResponseModel, ResponsePaginationModel } from "../method";
import { WorkingScheduleModel, WorkingScheduleParams } from "./models/WorkingScheduleModel";

export const useWorkingScheduleQuery = (params: WorkingScheduleParams) => {
  const apiCall = useApiCall<ResponsePaginationModel<WorkingScheduleModel>>({
    method: "GET",
    url: `${BASE_URL}/workscheds`,
    inputOptions: {
      ...params?.pagination,
      ...(params?.search ? { search: params.search } : {}),
    }
  });

  return useQuery({
    queryKey: ["workscheds", params],
    queryFn: async () => {
      return await apiCall();
    },
  });
}

export const useWorkingScheduleDetailQuery = (id: number | null) => {
  const apiCall = useApiCall<{data: WorkingScheduleModel}>({
    method: "GET",
    url: `${BASE_URL}/workscheds/${id}`,
  });

  return useQuery({
    queryKey: ["workscheds", id],
    queryFn: async () => {
      return await apiCall();
    },
    enabled: !!id
  });
}

export const useCreateWorkingSchedule = () => {
  const apiCall = useApiCall<ResponseModel<any>>({
    method: "POST",
    url: `${BASE_URL}/workscheds`,
  });

  return useMutation({
    mutationFn: async (data: WorkingScheduleModel) => {
      return await apiCall({ body: data });
    },
  })
}

export const useUpdateWorkingSchedule = () => {
  const apiCall = useApiCall<ResponseModel<any>>({
    method: "PUT",
    url: `${BASE_URL}/workscheds`,
  });
  return useMutation({
    mutationFn: async (data: WorkingScheduleModel) => {
      return await apiCall({ 
        url: `${BASE_URL}/workscheds/${data.id}`,
        body: data,
      });
    },
  })
}

export const useUnArchiveWorkingSchedule = () => {
  const apiCall = useApiCall<ResponseModel<any>>({
    method: "PUT",
    url: `${BASE_URL}/workscheds/undelete`,
  });
  return useMutation({
    mutationFn: async (id: number) => {
      return await apiCall({ 
        url: `${BASE_URL}/workscheds/undelete/${id}`,
      });
    },
  })
}

export const useDeleteWorkingSchedule = () => {
  const apiCall = useApiCall<ResponseModel<any>>({
    method: "DELETE",
    url: `${BASE_URL}/workscheds`,
  });
  return useMutation({
    mutationFn: async (id: number) => {
      return await apiCall({ 
        url: `${BASE_URL}/workscheds/${id}`,
      });
    },
  })
}