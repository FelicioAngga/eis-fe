import { useMutation, useQuery } from "@tanstack/react-query";
import { useApiCall } from "../../hooks/useApiCall";
import { BASE_URL } from "../../utils/base-url";
import { StartEndDateModel, StudentBehaviourModel } from "./models/StudentBehaviourModel";
import { ResponseModel } from "../method";

export const useGetStudentBehaviour = (academicId: number, termId: number) => {
  const apiCall = useApiCall<{ data: StudentBehaviourModel[] }>({
    method: "GET",
    url: `${BASE_URL}/students/behaviour/${academicId}/${termId}`,
  });

  return useQuery({
    queryKey: ["student-behaviour", academicId, termId],
    queryFn: async () => {
      return await apiCall();
    },
    refetchOnWindowFocus: false,
  });
}

export const useCreateStudentBehaviour = () => {
  const apiCall = useApiCall<ResponseModel<any>>({
    method: "POST",
    url: `${BASE_URL}/students/behaviour//`,
  });

  return useMutation({
    mutationFn: async (data: StudentBehaviourModel[]) => {
      return await apiCall({ 
        url: `${BASE_URL}/students/behaviour/${data[0].academic_id}/${data[0].term_id}`,
        body: data
      });
    },
  });
}

export const useUpdateStudentBehaviour = () => {
  const apiCall = useApiCall<ResponseModel<any>>({
    method: "PUT",
    url: `${BASE_URL}/students/behaviour//`,
  });

  return useMutation({
    mutationFn: async (data: StudentBehaviourModel[]) => {
      return await apiCall({ 
        url: `${BASE_URL}/students/behaviour/${data[0].academic_id}/${data[0].term_id}`,
        body: data
      });
    },
  });
}

export const useUpdateStartEndDateByTermId = () => {
  const apiCall = useApiCall<ResponseModel<any>>({
    method: "PUT",
    url: `${BASE_URL}/terms`,
  });

  return useMutation({
    mutationFn: async (data: StartEndDateModel) => {
      return await apiCall({ 
        url: `${BASE_URL}/terms/${data.id}`,
        body: data
      });
    },
  });
}