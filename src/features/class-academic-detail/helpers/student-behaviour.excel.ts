import { Workbook } from "exceljs";
import { StudentBehaviourModel } from "../../../api-hooks/student-behaviour/models/StudentBehaviourModel";
import fs from 'file-saver';
import { StudentModel } from "../../../api-hooks/students/models/StudentModel";

export const downloadStudentBehaviourExcel = async (studentsData: StudentModel[], studentBehaviour: StudentBehaviourModel[], month: string) => {
  const wb = new Workbook();
  const ws = wb.addWorksheet("sheet 1");
  ws.addRow([month])
  const headerRow = ws.addRow([
    "No",
    "NIS",
    "Nama Siswa",
    "Kelakuan",
    "Kerapian",
    "Kerajinan",
    "Catatan",
    "Ekstrakurikuler",
  ]);

  headerRow.eachCell((cell) => {
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
  });
  ws.mergeCells("H2:I2");

  let currentRow = 3;
  studentsData.forEach((student, index) => {
    const behaviour = studentBehaviour.find(b => b.student_nis === student.nis);
    const row = ws.addRow([
      index + 1,
      student.nis || "",
      student.full_name || "",
      (month === "Bulanan 1" ? behaviour?.first_behaviour : behaviour?.second_behaviour) || "",
      (month === "Bulanan 1" ? behaviour?.first_neatness : behaviour?.second_neatness) || "",
      (month === "Bulanan 1" ? behaviour?.first_crafts : behaviour?.second_crafts) || "",
      (month === "Bulanan 1" ? behaviour?.first_notes : behaviour?.second_notes) || "",
      (month === "Bulanan 1" ? behaviour?.first_month_extracurricular_first : behaviour?.second_month_extracurricular_first) || "",
      (month === "Bulanan 1" ? behaviour?.first_month_extracurricular_score_first : behaviour?.second_month_extracurricular_score_first) || "",
    ]);
    const row2 = ws.addRow([
      ...Array(7).fill(undefined),
      (month === "Bulanan 1" ? behaviour?.first_month_extracurricular_second : behaviour?.second_month_extracurricular_second) || "",
      (month === "Bulanan 1" ? behaviour?.first_month_extracurricular_score_second : behaviour?.second_month_extracurricular_score_second) || "",
    ])

    const untilRowNo = currentRow + 1;
    ws.mergeCells(`A${currentRow}:A${untilRowNo}`);
    ws.mergeCells(`B${currentRow}:B${untilRowNo}`);
    ws.mergeCells(`C${currentRow}:C${untilRowNo}`);
    ws.mergeCells(`D${currentRow}:D${untilRowNo}`);
    ws.mergeCells(`E${currentRow}:E${untilRowNo}`);
    ws.mergeCells(`F${currentRow}:F${untilRowNo}`);
    ws.mergeCells(`G${currentRow}:G${untilRowNo}`);
    currentRow = untilRowNo + 1;

    row.eachCell((cell) => {
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });
    row2.eachCell((cell) => {
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });
  });

  const columnWidths = [5, 10, 25, 15, 15, 15, 25, 20, 20];
  columnWidths.forEach((width, index) => {
    ws.getColumn(index + 1).width = width;
  });
  
  wb.xlsx.writeBuffer().then((data: any) => {
    const blob = new Blob([data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    fs.saveAs(blob, `Export-Kelakuan-Siswa-${month}` + ".xlsx");
  });
}

export const handleImportStudentBehaviourExcel = async (file: any, studentBehaviour: StudentBehaviourModel[], studentData: StudentModel[]): Promise<StudentBehaviourModel[]> => {
  const wb = new Workbook();
  await wb.xlsx.load(file);
  const workSheet = wb.getWorksheet(1);
  const month = workSheet?.getRow(1).getCell(1).value;
  const isFirstMonth = month === "Bulanan 1";
  let currentNIS = "";
  
  workSheet?.eachRow((row, rowNumber) => {
    const rowValues: any = row.values;
    if (rowNumber > 2) {
      for (let i = 0; i < studentData.length; i++) {
        const studentNis = rowValues[2];
        if (studentNis !== currentNIS) {
          currentNIS = studentNis;
          const existingBehaviour = studentBehaviour.find(b => b.student_nis === currentNIS);
          const foundedStudent = studentData.find(s => s.nis === studentNis)

          if (existingBehaviour) {
            if (isFirstMonth) {
              existingBehaviour.first_behaviour = rowValues[4] || "";
              existingBehaviour.first_neatness = rowValues[5] || "";
              existingBehaviour.first_crafts = rowValues[6] || "";
              existingBehaviour.first_notes = rowValues[7] || "";
              existingBehaviour.first_month_extracurricular_first = rowValues[8] || "";
              existingBehaviour.first_month_extracurricular_score_first = rowValues[9] || "";
              existingBehaviour.student_id = foundedStudent?.id || 0;
            } else {
              existingBehaviour.second_behaviour = rowValues[4] || "";
              existingBehaviour.second_neatness = rowValues[5] || "";
              existingBehaviour.second_crafts = rowValues[6] || "";
              existingBehaviour.second_notes = rowValues[7] || "";
              existingBehaviour.second_month_extracurricular_first = rowValues[8] || "";
              existingBehaviour.second_month_extracurricular_score_second = rowValues[9] || "";
              existingBehaviour.student_id = foundedStudent?.id || 0;
            }
          } else {
            studentBehaviour.push({
              student_id: foundedStudent?.id || 0,
              student_nis: studentNis,
              first_behaviour: isFirstMonth ? rowValues[4] || "" : "",
              first_neatness: isFirstMonth ? rowValues[5] || "" : "",
              first_crafts: isFirstMonth ? rowValues[6] || "" : "",
              first_notes: isFirstMonth ? rowValues[7] || "" : "",
              first_month_extracurricular_first: isFirstMonth ? rowValues[8] || "" : "",
              first_month_extracurricular_score_first: isFirstMonth ? rowValues[9] || "" : "",
              second_behaviour: isFirstMonth ? "" : rowValues[4] || "",
              second_neatness: isFirstMonth ? "" : rowValues[5] || "",
              second_crafts: isFirstMonth ? "" : rowValues[6] || "",
              second_notes: isFirstMonth ? "" : rowValues[7] || "",
              second_month_extracurricular_first: isFirstMonth ? "" : rowValues[8] || "",
              second_month_extracurricular_score_second: isFirstMonth ? "" : rowValues[9] || "",
            } as StudentBehaviourModel);
          }
        }
      }
    }
  });
  return studentBehaviour;
}