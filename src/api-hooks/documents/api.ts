import { useMutation, useQuery } from "@tanstack/react-query";
import { useApiCall } from "../../hooks/useApiCall";
import { BASE_URL } from "../../utils/base-url";
import { ResponseModel, ResponsePaginationModel } from "../method";
import { DocumentCreateModel, DocumentModel, DocumentParams } from "./models/DocumentModel";

export const useDocumentQuery = (params?: DocumentParams) => {
  const apiCall = useApiCall<ResponsePaginationModel<DocumentModel>>({
    method: "GET",
    url: `${BASE_URL}/documents`,
    inputOptions: {
      ...params?.pagination,
      ...(params?.search ? { search: params.search } : {}),
    }
  });

  return useQuery({
    queryKey: ["documents", params],
    queryFn: async () => {
      return await apiCall();
    },
  });
}

export const useCreateDocument = () => {
  const apiCall = useApiCall<ResponseModel<any>>({
    method: "POST",
    url: `${BASE_URL}/documents`,
  });

  return useMutation({
    mutationFn: async (data: DocumentCreateModel) => {
      return await apiCall({ 
        body: data
      });
    },
  });
}

export const useUpdateDocument = () => {
  const apiCall = useApiCall<ResponseModel<any>>({
    method: "PUT",
    url: `${BASE_URL}/documents`,
  });

  return useMutation({
    mutationFn: async (data: DocumentCreateModel) => {
      return await apiCall({ 
        url: `${BASE_URL}/documents/${data.id}`,
        body: data
      });
    },
  });
}

export const useDeleteDocument = () => {
  const apiCall = useApiCall<ResponseModel<any>>({
    method: "DELETE",
    url: `${BASE_URL}/documents`,
  });

  return useMutation({
    mutationFn: async (id: number) => {
      return await apiCall({ 
        url: `${BASE_URL}/documents/${id}`,
      });
    },
  });
}