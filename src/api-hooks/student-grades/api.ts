import { useMutation } from "@tanstack/react-query";
import { CreateStudentGradesModel } from "./models/StudentGradesModel";
import { BASE_URL } from "../../utils/base-url";
import { ResponseModel } from "../method";
import { useApiCall } from "../../hooks/useApiCall";

export const useCreateStudentGrades = () => {
  const apiCall = useApiCall<ResponseModel<any>>({
    method: "POST",
    url: `${BASE_URL}/academics//grades`,
  });

  return useMutation({
    mutationFn: async (data: CreateStudentGradesModel) => {
      return await apiCall({ 
        url: `${BASE_URL}/academics/${data.academic_id}/grades`,
        body: data
      });
    },
  });
}