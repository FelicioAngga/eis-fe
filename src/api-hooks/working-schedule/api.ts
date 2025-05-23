import { useQuery } from "@tanstack/react-query";
import { useApiCall } from "../../hooks/useApiCall";
import { BASE_URL } from "../../utils/base-url";
import { ResponsePaginationModel } from "../method";
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