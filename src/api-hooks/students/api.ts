import { useMutation, useQuery } from "@tanstack/react-query";
import { useApiCall } from "../../hooks/useApiCall";
import { BASE_URL } from "../../utils/base-url";
import { ResponseModel, ResponsePaginationModel } from "../method";
import { StudentModel, StudentParams, UpdateStudentAcademicIdModel } from "./models/StudentModel";
import { GuardianModel } from "../registration/models/RegistrationModel";

export const useStudentsQuery = (params?: StudentParams) => {
  const apiCall = useApiCall<ResponsePaginationModel<StudentModel>>({
    method: "GET",
    url: `${BASE_URL}/students`,
    inputOptions: {
      ...params?.pagination,
      ...(params?.search ? { search: params.search } : {}),
    }
  });

  return useQuery({
    queryKey: ["students", params],
    queryFn: async () => {
      return await apiCall();
    },
  });
}

export const useCreateStudent = () => {
  const apiCall = useApiCall<ResponseModel<any>>({
    method: "POST",
    url: `${BASE_URL}/students`,
  });

  return useMutation({
    mutationFn: async (data: StudentModel) => {
      return await apiCall({ 
        body: data
      });
    },
  });
}

export const useUpdateStudent = () => {
  const apiCall = useApiCall<ResponseModel<any>>({
    method: "PUT",
    url: `${BASE_URL}/students`,
  });

  return useMutation({
    mutationFn: async (data: StudentModel) => {
      return await apiCall({ 
        url: `${BASE_URL}/students/${data.id}`,
        body: data
      });
    },
  });
}

export const useUpdateAcademicIdByStudentIds = () => {
  const apiCall = useApiCall<ResponseModel<any>>({
    method: "PUT",
    url: `${BASE_URL}/students/update-current-academic/`,
  });

  return useMutation({
    mutationFn: async (data: UpdateStudentAcademicIdModel) => {
      return await apiCall({ 
        url: `${BASE_URL}/students/update-current-academic/${data.academic_id}`,
        body: data
      });
    },
  });
}

export const useDetailStudentQuery = (id: number) => {
  const apiCall = useApiCall<{data: StudentModel}>({
    method: "GET",
    url: `${BASE_URL}/students/${id}`,
  });

  return useQuery({
    queryKey: ["student", id],
    queryFn: async () => {
      return await apiCall();
    },
    enabled: !!id,
  });
}

export const useDetailStudentByToken = (enable: boolean = true) => {
  const apiCall = useApiCall<{data: StudentModel}>({
    method: "GET",
    url: `${BASE_URL}/students/my`,
  });
  return useQuery({
    queryKey: ["student-by-token"],
    queryFn: async () => {
      return await apiCall();
    },
    enabled: enable,
  });
}

export const useDeleteStudent = () => {
  const apiCall = useApiCall<ResponseModel<any>>({
    method: "DELETE",
    url: `${BASE_URL}/students`,
  });

  return useMutation({
    mutationFn: async (id: number) => {
      return await apiCall({ 
        url: `${BASE_URL}/students/${id}`,
      });
    },
  });
}

export const useCreateGuardian = () => {
  const apiCall = useApiCall<ResponseModel<any>>({
    method: "POST",
    url: `${BASE_URL}/guardians`,
  });

  return useMutation({
    mutationFn: async (data: GuardianModel[]) => {
      const promises = data.map(async (item) => await apiCall({ body: item })); 
      return await Promise.all(promises);
    },
  });
}

export const useUpdateGuardian = () => {
  const apiCall = useApiCall<ResponseModel<any>>({
    method: "PUT",
    url: `${BASE_URL}/guardians`,
  });
  return useMutation({
    mutationFn: async (data: GuardianModel[]) => {
      const promises = data.map(async (item) => await apiCall({ 
        url: `${BASE_URL}/guardians/${item.id}`,
        body: item
      })); 
      return await Promise.all(promises);
    },
  });
}