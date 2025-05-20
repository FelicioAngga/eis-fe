import { useMutation, useQuery } from "@tanstack/react-query";
import { useApiCall } from "../../hooks/useApiCall";
import { BASE_URL } from "../../utils/base-url";
import { ResponseModel, ResponsePaginationModel } from "../method";
import { DocumentTypeModel, DocumentTypeParams } from "./models/DocumentTypeModel";

export const useDocumentTypeQuery = (params?: DocumentTypeParams) => {
  const apiCall = useApiCall<ResponsePaginationModel<DocumentTypeModel>>({
    method: "GET",
    url: `${BASE_URL}/doctypes/browse`,
    inputOptions: {
      ...params?.pagination,
      ...(params?.search ? { search: params.search } : {}),
    }
  });

  return useQuery({
    queryKey: ["document-type", params],
    queryFn: async () => {
      return await apiCall();
    },
  });
}

export const useDeleteSubject = () => {
  const apiCall = useApiCall<ResponseModel<any>>({
    method: "DELETE",
    url: `${BASE_URL}/doctypes`,
  });

  return useMutation({
    mutationFn: async (id: number) => {
      return await apiCall({ 
        url: `${BASE_URL}/doctypes/${id}`,
      });
    },
  });
}