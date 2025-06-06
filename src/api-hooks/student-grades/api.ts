import { useMutation, useQuery } from "@tanstack/react-query";
import { StudentGradesModel, StudentScoreModel } from "./models/StudentGradesModel";
import { BASE_URL } from "../../utils/base-url";
import { ResponseModel } from "../method";
import { useApiCall } from "../../hooks/useApiCall";

export const useGetStudentGrades = (academicId: number) => {
  const apiCall = useApiCall<{ data: StudentGradesModel }>({
    method: "GET",
    url: `${BASE_URL}/academics/${academicId}/grades`,
  });

  return useQuery({
    queryKey: ["student-grades", academicId],
    queryFn: async () => {
      return await apiCall();
    },
  });
}

export const useGetStudentGradeByToken = () => {
  const apiCall = useApiCall<{ data: StudentScoreModel[] }>({
    method: "GET",
    url: `${BASE_URL}/students/score`,
  });

  return useQuery({
    queryKey: ["student-grades-by-token"],
    queryFn: async () => {
      return await apiCall();
    },
  });
}

export const useCreateStudentGrades = () => {
  const apiCall = useApiCall<ResponseModel<any>>({
    method: "POST",
    url: `${BASE_URL}/academics//grades`,
  });

  return useMutation({
    mutationFn: async (data: StudentGradesModel) => {
      return await apiCall({ 
        url: `${BASE_URL}/academics/${data.academic_id}/grades`,
        body: data
      });
    },
  });
}

export const useUpdateStudentGrades = () => {
  const apiCall = useApiCall<ResponseModel<any>>({
    method: "PUT",
    url: `${BASE_URL}/academics//grades`,
  });

  return useMutation({
    mutationFn: async (data: StudentGradesModel) => {
      return await apiCall({ 
        url: `${BASE_URL}/academics/${data.academic_id}/grades`,
        body: data
      });
    },
  });
}
