import { StudentGradesDetailModel } from "../../../api-hooks/student-grades/models/StudentGradesModel";
import { Workbook } from "exceljs";
import fs from 'file-saver';
import { UpdateAcademicStudentNoteModel } from "../../../api-hooks/class/models/ClassModel";

export const downloadStudentMarksExcel = (
  studentMarks: StudentGradesDetailModel[],
  teacherNotes: UpdateAcademicStudentNoteModel[],
  isFirstTerm: boolean,
  showStudentClassNote: boolean
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
    const studentMarkFirstQuiz = [];
    const studentMarkFirstMonth = [];
    const studentMarkSecondQuiz = [];
    const studentMarkSecondMonth = [];
    const studentMarkFinals = [];
    const studentMarkRemarks = [];

    for (const mark of studentMarks) {
      const studentMark = mark.students.find((s) => s.student_id === student.student_id) || {};
      studentMarkFirstQuiz.push(studentMark.first_quiz || "");
      studentMarkFirstMonth.push(studentMark.first_month || "");
      studentMarkSecondQuiz.push(studentMark.second_quiz || "");
      studentMarkSecondMonth.push(studentMark.second_month || "");
      studentMarkFinals.push(studentMark.finals || "");
      studentMarkRemarks.push(studentMark.remarks || "");
    }

    const row = ws.addRow([
      i + 1,
      student.nis,
      student.student_name,
      "Tugas Bulanan 1",
      ...studentMarkFirstQuiz,
    ]);
    const row2 = ws.addRow([
      ...Array(3).fill(undefined),
      "Ujian Bulanan 1",
      ...studentMarkFirstMonth,
    ]);
    const row4 = ws.addRow([
      ...Array(3).fill(undefined),
      "Tugas Bulanan 2",
      ...studentMarkSecondQuiz,
    ]);
    const row3 = ws.addRow([
      ...Array(3).fill(undefined),
      "Ujian Bulanan 2",
      ...studentMarkSecondMonth,
    ]);
    const row5 = ws.addRow([
      ...Array(3).fill(undefined),
      "Ujian Akhir",
      ...studentMarkFinals,
    ]);

    const teacherNote = teacherNotes.find(note => note.student_id === student.student_id);
    const row6 = ws.addRow([
      ...Array(3).fill(undefined),
      showStudentClassNote ? "Catatan Wali Kelas" : "",
      isFirstTerm ? teacherNote?.first_term_notes || "" : teacherNote?.second_term_notes || "",
    ]);

    const untilRowNo = currentRow + 5;
    ws.mergeCells(`E${untilRowNo}:${getExcelColumnLetter(studentMarks.length + 4)}${untilRowNo}`)
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
    row6.eachCell((cell) => {
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });
    if (!showStudentClassNote) {
      row6.eachCell((cell: any, colNum) => {
        if (colNum >= 4) {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'D3D3D3' }
          }
        }
      })
    }
  }

  const columnWidths = [5, 10, 25, 20, ...Array(studentMarks.length).fill(25)];
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

export const handleImportStudentMarks = async (
  fileData: any,
  studentMarks: StudentGradesDetailModel[],
  studentNotes: UpdateAcademicStudentNoteModel[],
  isFirstTerm: boolean,
): Promise<{
  studentGrades: StudentGradesDetailModel[];
  studentNotes: UpdateAcademicStudentNoteModel[];
}> => {
  const wb = new Workbook();
  await wb.xlsx.load(fileData);
  const workSheet = wb.getWorksheet(1);

  workSheet?.eachRow((row, rowNumber) => {
    const rowValues: any = row.values;
    if (rowNumber > 1) {
      const studentNis = rowValues[2]
      for (let i = 0; i < studentMarks.length; i++) {
        const studentMark = studentMarks[i].students?.find(s => s.nis === studentNis);
        if (studentMark && (rowNumber - 2) % 6 === 0 && rowNumber >= 2) {
          studentMark.first_quiz = rowValues[5 + i] || undefined;
        }
        if (studentMark && (rowNumber - 3) % 6 === 0 && rowNumber >= 3) {
          studentMark.first_month = rowValues[5 + i] || undefined;
        }
         if (studentMark && (rowNumber - 4) % 6 === 0 && rowNumber >= 4) {
          studentMark.second_quiz = rowValues[5 + i] || undefined;
        }
        if (studentMark && (rowNumber - 5) % 6 === 0 && rowNumber >= 5) {
          studentMark.second_month = rowValues[5 + i] || undefined;
        }
        if (studentMark && (rowNumber - 6) % 6 === 0 && rowNumber >= 6) {
          studentMark.finals = rowValues[5 + i] || undefined;
        }
        if (studentMark && (rowNumber - 7) % 6 === 0 && rowNumber >= 7) {
          const studentNote = studentNotes.find(note => note.student_id === studentMark.student_id)
          if (studentNote) {
            if (isFirstTerm) studentNote.first_term_notes = rowValues[5 + i] || undefined;
            else studentNote.second_term_notes = rowValues[5 + i] || undefined;
          }
        }
      }
    }
  });

  return {
    studentGrades: studentMarks,
    studentNotes,
  };
}

function getExcelColumnLetter(colNum: number): string {
  let temp: any = '', letter: any = '';
  while (colNum > 0) {
    temp = (colNum - 1) % 26;
    letter = String.fromCharCode(temp + 65) + letter;
    colNum = (colNum - temp - 1) / 26;
  }
  return letter;
}
