import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useGetStudentMonthlyReport } from "../../../api-hooks/student-grades/api";

import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";

function PrintStudentMonthlyReport() {
  const [pdfPreview, setPdfPreview] = useState<string | null>(null);
  const iframeRef = useRef(null);
  const doc = useRef<jsPDF | null>(null);

  const { student_id, academic_id } = useParams();
  const studentIds = student_id ? student_id.split(',').map((id) => parseInt(id)) : [];
  const { data: reportDatas, isFetched: isReportFetched } = useGetStudentMonthlyReport(parseInt(academic_id || "0"), studentIds);

  useEffect(() => {
    if (!isReportFetched || (reportDatas?.data?.length || 0) < 1) return;
    const docInstance = new jsPDF('l', 'mm', 'legal');
    const pageWidth = docInstance.internal.pageSize.width;

    reportDatas?.data.forEach((reportData, index) => {
      const writePage = (doc: jsPDF) => {
        const headerText = 'LAPORAN HASIL BELAJAR SISWA';
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        const textWidth = doc.getTextWidth(headerText);
        const xPos = (pageWidth - textWidth) / 2;
        doc.text(headerText, xPos, 12);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        let startY = 20;
        const lineHeight = 6;

        const lines = [
          { label: 'Nama Siswa', value: `${reportData?.name}`, align: "left" },
          { label: 'Nomor Induk Siswa', value: `${reportData?.nis}`, align: "left" },
          { label: 'Kelas', value: `${reportData?.class}`, align: "right" },
          { label: 'Tahun Pelajaran', value: `${reportData?.academic_year}`, align: "right" },
        ];

        lines.forEach((line, index) => {
          const labelX = line.align === "left" ? 10 : 255;
          const valueX = line.align === "left" ? 70 : 300;
          const yOffset = startY + (index % 2) * lineHeight;
          doc.setFont('helvetica', 'bold');
          doc.text(line.label, labelX , yOffset);
          doc.text(`: `, valueX , yOffset);
          doc.setFont('helvetica', 'normal');
          doc.text(line.value, valueX + 2, yOffset);
        });

        const academicData: { no: number; subject: string; st_first_quiz: number, st_second_quiz: number, st_first_month: number, st_second_month: number, nd_first_quiz: number, nd_second_quiz: number, nd_first_month: number, nd_second_month: number }[] = [];
        reportData?.grades.forEach((grade, index) => {
          academicData.push({
            no: index + 1,
            subject: grade.subject,
            st_first_quiz: grade.st_first_quiz,
            st_second_quiz: grade.st_second_quiz,
            st_first_month: grade.st_first_month,
            st_second_month: grade.st_second_month,
            nd_first_quiz: grade.nd_first_quiz,
            nd_second_quiz: grade.nd_second_quiz,
            nd_first_month: grade.nd_first_month,
            nd_second_month: grade.nd_second_month,
          })
        });
        const rowTotal = reportData?.grades.length || 1;
        const rowHeight = 6.775;
        autoTable(doc, {
          startY: startY + 10,
          tableWidth: "wrap",
          margin: { left: 10, right: 10 },
          head: [
            [
              {content: "No.", rowSpan: 3},
              {content: "Mata Pelajaran", rowSpan: 3},
              {content: "KBM", rowSpan: 3},
              {content: "Semester I", colSpan: 4},
              {content: "Semester II", colSpan: 4},
            ],
            [
              {content: "Ulangan Harian I", colSpan: 2},
              {content: "Ulangan Harian II", colSpan: 2},
              {content: "Ulangan Harian I", colSpan: 2},
              {content: "Ulangan Harian II", colSpan: 2},
            ],
            [
              {content: "P"},
              {content: "K"},
              {content: "P"},
              {content: "K"},
              {content: "P"},
              {content: "K"},
              {content: "P"},
              {content: "K"},
            ]
          ],
          headStyles: {
            fontSize: 8,
            fillColor: "#fff",
            halign: "center",
            valign: "middle",
            minCellHeight: 5,
            lineWidth: 0.1,
            lineColor: "#000",
          },
          body: academicData.map((item) => [
            item.no,
            item.subject,
            70,
            item.st_first_quiz,
            item.st_second_quiz,
            item.st_first_month,
            item.st_second_month,
            item.nd_first_quiz,
            item.nd_second_quiz,
            item.nd_first_month,
            item.nd_second_month,
          ]),
          styles: {
            fillColor: "#fff",
            fontSize: 8,
            overflow: "linebreak",
            valign: "middle",
            lineWidth: 0.1,
            lineColor: "#000",
            textColor: "#000",
            minCellHeight: 5,
          },
          columnStyles: {
            0: { cellWidth: 10, halign: "center", fillColor: "#fff" },
            1: { cellWidth: 72, fillColor: "#fff" },
            2: { cellWidth: 18, halign: "center", fillColor: "#fff" },
            3: { cellWidth: 18, halign: "center", fillColor: "#fff" },
            4: { cellWidth: 18, halign: "center", fillColor: "#fff" },
            5: { cellWidth: 18, halign: "center", fillColor: "#fff" },
            6: { cellWidth: 18, halign: "center", fillColor: "#fff" },
            7: { cellWidth: 18, halign: "center", fillColor: "#fff" },
            8: { cellWidth: 18, halign: "center", fillColor: "#fff" },
            9: { cellWidth: 18, halign: "center", fillColor: "#fff" },
            10: { cellWidth: 18, halign: "center", fillColor: "#fff" },
          },
          pageBreak: "avoid",
        });
        autoTable(doc, {
          useCss: true,
          startY: startY + 10,
          tableWidth: "wrap",
          margin: { left: 254, right: 10 },
          tableLineColor: "#000",
          tableLineWidth: 0.1,
          body: [
            ["", "", ""],
            ["Catatan: ", {content: `Medan, ${reportData?.st_first_date}`, colSpan: 2, styles: { halign: "right" }}],
            [
              {content: reportData?.st_first_notes, rowSpan: 4, styles: { halign: "left", valign: "top" }},
              {content: "Wali Kelas,", styles: { halign: "center" }},
              {content: "Orang Tua/Wali,", styles: { halign: "center" }},
            ],
            ["", ""],
            ["", ""],
            [
              {content: `${reportData?.home_room_teacher}`, styles: { halign: "center" }},
              {content: "____________", styles: { halign: "center" }},
            ],
            ["", "", ""],
            ["Catatan: ", {content: `Medan, ${reportData?.st_second_date}`, colSpan: 2, styles: { halign: "right" }}],
            [
              {content: reportData?.st_second_notes, rowSpan: 4, styles: { halign: "left", valign: "top" }},
              {content: "Wali Kelas,", styles: { halign: "center" }},
              {content: "Orang Tua/Wali,", styles: { halign: "center" }},
            ],
            ["", ""],
            ["", ""],
            [
              {content: `${reportData?.home_room_teacher}`, styles: { halign: "center" }},
              {content: "____________", styles: { halign: "center" }},
            ],
            ["", "", ""],
            ["Catatan: ", {content: `Medan, ${reportData?.nd_first_date}`, colSpan: 2, styles: { halign: "right" }}],
            [
              {content: reportData?.nd_first_notes, rowSpan: 4, styles: { halign: "left", valign: "top" }},
              {content: "Wali Kelas,", styles: { halign: "center" }},
              {content: "Orang Tua/Wali,", styles: { halign: "center" }},
            ],
            ["", ""],
            ["", ""],
            [
              {content: `${reportData?.home_room_teacher}`, styles: { halign: "center" }},
              {content: "____________", styles: { halign: "center" }},
            ],
            ["", "", ""],
            ["Catatan: ", {content: `Medan, ${reportData?.nd_second_date}`, colSpan: 2, styles: { halign: "right" }}],
            [
              {content: reportData?.nd_second_notes, rowSpan: 4, styles: { halign: "left", valign: "top" }},
              {content: "Wali Kelas,", styles: { halign: "center" }},
              {content: "Orang Tua/Wali,", styles: { halign: "center" }},
            ],
            ["", ""],
            ["", ""],
            [
              {content: `${reportData?.home_room_teacher}`, styles: { halign: "center" }},
              {content: "____________", styles: { halign: "center" }},
            ],
            ["", "", ""],
          ],
          styles: {
            fillColor: "#fff",
            fontSize: 8,
            overflow: "linebreak",
            valign: "middle",
            textColor: "#000",
            minCellHeight: 4,
          },
          columnStyles: {
            0: { cellWidth: 40, fillColor: "#fff" },
            1: { cellWidth: 26, fillColor: "#fff" },
            2: { cellWidth: 26, fillColor: "#fff" },
          },
        });
        doc.setLineWidth(0.1);
        doc.line(254, 75, 346, 75);
        doc.line(254, 115.5, 346, 115.5);
        doc.line(254, 156, 346, 156);
        autoTable(doc, {
          startY: (rowTotal + 3) * rowHeight + 30,
          tableWidth: "wrap",
          margin: { left: 10, right: 10 },
          body: [
            [
              {content: "Ekstrakurikuler", rowSpan: 2},
              reportData?.st_first_extracurricular_first,
              reportData?.st_first_extracurricular_score_first,
              reportData?.st_second_extracurricular_score_first,
              reportData?.nd_first_extracurricular_score_first,
              reportData?.nd_second_extracurricular_score_first,
            ],
            [
              reportData?.st_first_extracurricular_second,
              reportData?.st_first_extracurricular_score_second,
              reportData?.st_second_extracurricular_score_second,
              reportData?.nd_first_extracurricular_score_second,
              reportData?.nd_second_extracurricular_score_second,
            ],
          ],
          styles: {
            fillColor: "#fff",
            fontSize: 8,
            overflow: "linebreak",
            valign: "middle",
            lineWidth: 0.1,
            lineColor: "#000",
            textColor: "#000",
            minCellHeight: 5,
          },
          columnStyles: {
            0: { cellWidth: 50, halign: "center", fillColor: "#fff" },
            1: { cellWidth: 50, halign: "left", fillColor: "#fff" },
            2: { cellWidth: 36, halign: "center", fillColor: "#fff" },
            3: { cellWidth: 36, halign: "center", fillColor: "#fff" },
            4: { cellWidth: 36, halign: "center", fillColor: "#fff" },
            5: { cellWidth: 36, halign: "center", fillColor: "#fff" },
          },
        });
        autoTable(doc, {
          startY: (rowTotal + 5) * rowHeight + 30,
          tableWidth: "wrap",
          margin: { left: 10, right: 10 },
          body: [
            [
              {content: "D\nA\nT\nA", rowSpan: 6},
              {content: "Kepribadian", rowSpan: 3},
              "Kelakuan",
              reportData?.st_first_behavior,
              reportData?.st_second_behavior,
              reportData?.nd_first_behavior,
              reportData?.nd_second_behavior,
            ],
            [
              "Kerajian",
              reportData?.st_first_craft,
              reportData?.st_second_craft,
              reportData?.nd_first_craft,
              reportData?.nd_second_craft
            ],
            [
              "Kerapian",
              reportData?.st_first_tidiness,
              reportData?.st_second_tidiness,
              reportData?.nd_first_tidiness,
              reportData?.nd_second_tidiness
            ],
            [
              {content: "Ketidakhadiran", rowSpan: 3},
              "Sakit",
              `  ${reportData?.st_first_sick || '-'}   hari`,
              `  ${reportData?.st_second_sick || '-'}   hari`,
              `  ${reportData?.nd_first_sick || '-'}   hari`,
              `  ${reportData?.nd_second_sick || '-'}   hari`,
            ],
            [
              "Izin",
              `  ${reportData?.st_first_permission || '-'}   hari`,
              `  ${reportData?.st_second_permission || '-'}   hari`,
              `  ${reportData?.nd_first_permission || '-'}   hari`,
              `  ${reportData?.nd_second_permission || '-'}   hari`
            ],
            [
              "Tanpa Keterangan",
              `  ${reportData?.st_first_absent || '-'}   hari`,
              `  ${reportData?.st_second_absent || '-'}   hari`,
              `  ${reportData?.nd_first_absent || '-'}   hari`,
              `  ${reportData?.nd_second_absent || '-'}   hari`
            ]
          ],
          styles: {
            fillColor: "#fff",
            fontSize: 8,
            overflow: "linebreak",
            valign: "middle",
            lineWidth: 0.1,
            lineColor: "#000",
            textColor: "#000",
            minCellHeight: 5,
          },
          columnStyles: {
            0: { cellWidth: 10, halign: "center", fillColor: "#fff" },
            1: { cellWidth: 45, halign: "center", valign: "middle", fillColor: "#fff" },
            2: { cellWidth: 45, halign: "left", fillColor: "#fff" },
            3: { cellWidth: 36, halign: "center", fillColor: "#fff" },
            4: { cellWidth: 36, halign: "center", fillColor: "#fff" },
            5: { cellWidth: 36, halign: "center", fillColor: "#fff" },
            6: { cellWidth: 36, halign: "center", fillColor: "#fff" },
          },
          pageBreak: "avoid",
        });
        doc.setFont('helvetica', 'bolditalic');
        doc.text("KBM: Ketuntasan Belajar Minimal, P: Pengetahuan, K: Keterampilan", 10, (rowTotal + 11) * rowHeight + 34);
      };

      writePage(docInstance);
      if (index < reportDatas?.data.length - 1) {
        docInstance.addPage();
      };
    });

    const pdfBlob = docInstance.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);

    setPdfPreview(pdfUrl);

    doc.current = docInstance;

    return () => {
      if (pdfPreview) {
        URL.revokeObjectURL(pdfPreview);
      }
    };
  }, [isReportFetched, reportDatas]);

  return (
    <div>
      {pdfPreview && (
        <div>
          <iframe ref={iframeRef} src={pdfPreview} width="100%" height="700px" title="PDF Preview"></iframe>
        </div>
      )}
    </div>
  );
}

export default PrintStudentMonthlyReport;
