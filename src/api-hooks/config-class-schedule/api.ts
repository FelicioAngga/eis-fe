import { useMutation, useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../../utils/base-url";
import { useApiCall } from "../../hooks/useApiCall";
import { ResponseModel } from "../method";
import { ConfigClassSchedModel, CreateConfigClassSchedModel, UpdateConfigClassSchedModel } from "./models/ConfigClassScheduleModel";

export const useGetScheduleByAcademicId = (academicId: number) => {
  const apiCall = useApiCall<{data: ConfigClassSchedModel[] }>({
    method: "GET",
    url: `${BASE_URL}/subjectschedules/academic/${academicId}`,
  });
  
  return useQuery({
    queryKey: ["config-class-schedules", academicId],
    queryFn: async () => {
      return await apiCall();
    },
  });
}

export const useCreateClassScheduleConfig = () => {
  const apiCall = useApiCall<ResponseModel<any>>({
    method: "POST",
    url: `${BASE_URL}/subjectschedules`,
  });

  return useMutation({
    mutationFn: async (data: CreateConfigClassSchedModel) => {
      return await apiCall({ 
        body: data
      });
    },
  });
}

export const useUpdateClassScheduleConfig = () => {
  const apiCall = useApiCall<ResponseModel<any>>({
    method: "PUT",
    url: `${BASE_URL}/subjectschedules`,
  });

  return useMutation({
    mutationFn: async (data: UpdateConfigClassSchedModel) => {
      return await apiCall({ 
        body: data
      });
    },
  });
}