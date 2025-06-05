import { useQuery } from "@tanstack/react-query";
import { useApiCall } from "../../hooks/useApiCall";
import { BASE_URL } from "../../utils/base-url";
import { ClassNoteModel } from "./models/ClassNoteModel";

export const useTeacherScheduleQuery = (date: string) => {
  const apiCall = useApiCall<{ data: ClassNoteModel[] }>({
    method: "GET",
    url: `${BASE_URL}/teachers/schedules?date=${date}`,
  });

  return useQuery({
    queryKey: ["teacher-schedules", date],
    queryFn: async () => {
      return await apiCall();
    },
  });
}