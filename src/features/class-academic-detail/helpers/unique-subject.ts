import { UniqueSubject } from "../../../api-hooks/class/models/ClassModel";

interface ScheduleEntry {
  id?: number;
  subject_id: number;
  subject: string;
  teacher: string;
  teacher_id: number;
  start_hour: string;
  end_hour: string;
}

interface DaySchedule {
  day: string;
  entries: ScheduleEntry[];
}


/**
 * Extracts unique subjects from the schedule data.
 * @param data - The array of day schedules.
 * @returns An array of unique subjects with their IDs.
 */
export const getUniqueSubjects = (data: DaySchedule[]): UniqueSubject[] => {
  const uniqueSubjectsMap = new Map<number, UniqueSubject>();
  data.forEach((daySchedule) => {
    daySchedule.entries.forEach((entry) => {
      if (!uniqueSubjectsMap.has(entry.subject_id)) {
        uniqueSubjectsMap.set(entry.subject_id, {
          subject_id: entry.subject_id,
          subject: entry.subject,
        });
      }
    });
  });

  return Array.from(uniqueSubjectsMap.values());
};
