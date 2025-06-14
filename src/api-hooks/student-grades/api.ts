import { useMutation, useQuery } from "@tanstack/react-query";
import { StudentGradeReportModel, StudentGradeReportParams, StudentGradesModel, StudentScoreModel } from "./models/StudentGradesModel";
import { BASE_URL } from "../../utils/base-url";
import { ResponseModel } from "../method";
import { useApiCall } from "../../hooks/useApiCall";

export const useGetStudentGrades = (academicId: number, termId: number) => {
  const apiCall = useApiCall<{ data: StudentGradesModel }>({
    method: "GET",
    url: `${BASE_URL}/academics/${academicId}/${termId}/grades`,
  });

  return useQuery({
    queryKey: ["student-grades", academicId, termId],
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
        url: `${BASE_URL}/academics/${data.academic_id}/${data.term_id}/grades`,
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
        url: `${BASE_URL}/academics/${data.academic_id}/${data.term_id}/grades`,
        body: data
      });
    },
  });
}

export const useGetExamRecap = (params: StudentGradeReportParams) => {
  const apiCall = useApiCall<{data: StudentGradeReportModel[] }>({
    method: "GET",
    url: `${BASE_URL}/students/marks/report`,
    inputOptions: {
      limit: undefined,
      page: undefined,
      sortOrder: undefined,
      sortColumn: undefined,
      ...(params?.academic_year ? { academic_year: params.academic_year } : {}),
      ...(params?.level_id ? { level_id: params.level_id } : {}),
      ...(params?.academic_id ? { academic_id: params.academic_id } : {}),
    }
  });

  return useQuery({
    queryKey: ["exam-recap", params],
    queryFn: async () => {
      return await apiCall();
    },
  });
}