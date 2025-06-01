import { useMutation, useQuery } from "@tanstack/react-query";
import { useApiCall } from "../../hooks/useApiCall";
import { BASE_URL } from "../../utils/base-url";
import { ResponseModel, ResponsePaginationModel } from "../method";
import { ResponseStudentAbsenceModel, StudentAbsenceModel, StudentAbsenceParams, UpdateAbsenceModel } from "./models/AbsenceModel";

export const useCreateAbsenceBatch = () => {
  const apiCall = useApiCall<ResponseModel<any>>({
    method: "POST",
    url: `${BASE_URL}/students/attendances/batch`,
  });

  return useMutation({
    mutationFn: async (data: { name: string }) => {
      return await apiCall({ 
        body: data
      });
    },
  });
}

export const useBrowseAbsenceByAcademicId = (academicId: number, date: string, params: StudentAbsenceParams) => {
  const apiCall = useApiCall<ResponseStudentAbsenceModel>({
    method: "GET",
    url: `${BASE_URL}/academics/${academicId}/attendances`,
    inputOptions: {
      ...params?.pagination,
      ...(date ? { date: date } : {}),
    }
  });

  return useQuery({
    queryKey: ["student-attendances", date, params],
    queryFn: async () => {
      return await apiCall();
    },
  });
}

export const useUpdateAbsence = () => {
  const apiCall = useApiCall<ResponseModel<any>>({
    method: "PUT",
    url: `${BASE_URL}/academics/attendances`,
  });
  return useMutation({
    mutationFn: async (data: UpdateAbsenceModel) => {
      return await apiCall({ 
        url: `${BASE_URL}/academics/${data.academic_id}/attendances`,
        body: data
      });
    },
  });
}