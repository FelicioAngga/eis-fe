import {Workbook} from 'exceljs';
import { TeacherAbsenceCreateModel } from '../../../api-hooks/teacher-absence/models/TeacherAbsenceModel';

export const handleImportTeacherAbsence = async (fileData: any): Promise<TeacherAbsenceCreateModel[]> => {
  const wb = new Workbook();
  await wb.xlsx.load(fileData);
  const workSheet = wb.getWorksheet(1);

  const teacherAbsenceList: TeacherAbsenceCreateModel[] = [];
  workSheet?.eachRow((row, rowNumber) => {
    const rowValues: any = row.values;
    if (rowNumber > 1) {
      teacherAbsenceList.push({
        teacher_id: rowValues[2],
        date: rowValues[3],
      })
    }
  });
  const result = summarizeLogTimes(teacherAbsenceList)
  return result;
}

function summarizeLogTimes(teacherAbsencedata: TeacherAbsenceCreateModel[]): TeacherAbsenceCreateModel[] {
  const result: TeacherAbsenceCreateModel[] = [];
  teacherAbsencedata.forEach(absence => {
    if (result.some(item => item.teacher_id === absence.teacher_id && item.date === formatCustomDateTime(absence.date)?.dateOnly)) return;
    const teacherWithSameIdAndDate = teacherAbsencedata.filter(findItem => {
      return findItem.teacher_id === absence.teacher_id && findItem.date.split(" ")[0] === absence.date.split(" ")[0]
    });

    if (teacherWithSameIdAndDate.length === 0) return;
    teacherWithSameIdAndDate.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    result.push({
      ...absence,
      date: formatCustomDateTime(teacherWithSameIdAndDate[0]?.date || "").dateOnly,
      log_in_time: formatCustomDateTime(teacherWithSameIdAndDate[0]?.date || "").timeOnly,
      log_out_time: formatCustomDateTime(teacherWithSameIdAndDate[teacherWithSameIdAndDate.length - 1]?.date || "").timeOnly,
    });
  });
  return result;
}

function formatCustomDateTime(dateString: string): { timeOnly: string; dateOnly: string } {
  if (!dateString) {
    return {
      timeOnly: "-",
      dateOnly: "-"
    };
  }

  const parts = dateString.split(" ");
  const datePart = parts[0];
  const timeOnly = parts[1];

  const dateComponents = datePart.split("/");
  const day = dateComponents[0];
  const month = dateComponents[1];
  const year = dateComponents[2];
  const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

  return {
    timeOnly: timeOnly,
    dateOnly: formattedDate
  };
}
