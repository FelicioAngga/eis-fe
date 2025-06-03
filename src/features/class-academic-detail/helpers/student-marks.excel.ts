import { StudentGradesDetailModel } from "../../../api-hooks/student-grades/models/StudentGradesModel";
import { Workbook } from "exceljs";
import fs from 'file-saver';

export const downloadStudentMarksExcel = (
  studentMarks: StudentGradesDetailModel[],
) => {
  const wb = new Workbook();
  const ws = wb.addWorksheet("sheet 1");

  const headerRow = ws.addRow([
    "No",
    "NIS",
    "Nama Siswa",
    "Nilai",
    ...studentMarks.map((studentMark) => studentMark.subject_name),
  ]);

  headerRow.eachCell((cell) => {
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
  });

  const students = studentMarks[0].students;
  let currentRow = 2;
  for (let i = 0; i < students.length; i++) {
    const student = students[i];
    const studentMarkQuiz = [];
    const studentMarkFirstMonth = [];
    const studentMarkSecondMonth = [];
    const studentMarkFinals = [];
    const studentMarkRemarks = [];

    for (const mark of studentMarks) {
      const studentMark = mark.students.find((s) => s.student_id === student.student_id) || {};
      studentMarkQuiz.push(studentMark.quiz || "");
      studentMarkFirstMonth.push(studentMark.first_month || "");
      studentMarkSecondMonth.push(studentMark.second_month || "");
      studentMarkFinals.push(studentMark.finals || "");
      studentMarkRemarks.push(studentMark.remarks || "");
    }

    const row = ws.addRow([
      i + 1,
      student.nis,
      student.student_name,
      "Tugas",
      ...studentMarkQuiz,
    ]);
    const row2 = ws.addRow([
      ...Array(3).fill(undefined),
      "Ujian Bulanan 1",
      ...studentMarkFirstMonth,
    ]);
    const row3 = ws.addRow([
      ...Array(3).fill(undefined),
      "Ujian Bulanan 2",
      ...studentMarkSecondMonth,
    ]);
    const row4 = ws.addRow([
      ...Array(3).fill(undefined),
      "Ujian Akhir",
      ...studentMarkFinals,
    ]);
    const row5 = ws.addRow([
      ...Array(3).fill(undefined),
      "Deskripsi",
      ...studentMarkRemarks,
    ]);

    const untilRowNo = currentRow + 4;
    ws.mergeCells(`A${currentRow}:A${untilRowNo}`);
    ws.mergeCells(`B${currentRow}:B${untilRowNo}`);
    ws.mergeCells(`C${currentRow}:C${untilRowNo}`);
    currentRow = untilRowNo + 1;

    row.eachCell((cell, colNumber) => {
      if (colNumber === 1 || colNumber === 2 || colNumber === 3) {
        cell.alignment = { vertical: "top", horizontal: "left" };
      }
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
    row3.eachCell((cell) => {
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });
    row4.eachCell((cell) => {
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });
    row5.eachCell((cell) => {
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });
  }

  const columnWidths = [5, 10, 25, 15, ...Array(studentMarks.length).fill(20)];
  columnWidths.forEach((width, index) => {
    ws.getColumn(index + 1).width = width;
  });
  
  wb.xlsx.writeBuffer().then((data: any) => {
    const blob = new Blob([data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    fs.saveAs(blob, "Export-Nilai-Siswa" + ".xlsx");
  });
};

export const handleImportStudentMarks = async (fileData: any, studentMarks: StudentGradesDetailModel[]): Promise<StudentGradesDetailModel[]> => {
  const wb = new Workbook();
  await wb.xlsx.load(fileData);
  const workSheet = wb.getWorksheet(1);

  workSheet?.eachRow((row, rowNumber) => {
    const rowValues: any = row.values;
    if (rowNumber > 1) {
      const studentNis = rowValues[2]
      for (let i = 0; i < studentMarks.length; i++) {
        const studentMark = studentMarks[i].students.find(s => s.nis === studentNis);
        if (studentMark && (rowNumber - 2) % 5 === 0 && rowNumber >= 2) {
          studentMark.quiz = rowValues[5 + i] || undefined;
        }
        if (studentMark && (rowNumber - 3) % 5 === 0 && rowNumber >= 3) {
          studentMark.first_month = rowValues[5 + i] || undefined;
        }
        if (studentMark && (rowNumber - 4) % 5 === 0 && rowNumber >= 4) {
          studentMark.second_month = rowValues[5 + i] || undefined;
        }
        if (studentMark && (rowNumber - 5) % 5 === 0 && rowNumber >= 5) {
          studentMark.finals = rowValues[5 + i] || undefined;
        }
        if (studentMark && (rowNumber - 6) % 5 === 0 && rowNumber >= 6) {
          studentMark.remarks = rowValues[5 + i] || undefined;
        }
      }
    }
  });
  return studentMarks;
}