import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useGetStudentReport } from "../../../api-hooks/student-grades/api";

import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";

function PrintStudentMonthlyReport() {
  const [pdfPreview, setPdfPreview] = useState<string | null>(null);
  const iframeRef = useRef(null);
  const doc = useRef<jsPDF | null>(null);

  const { student_id, academic_id, term_id } = useParams();
  const { data: reportData, isFetched: isReportFetched } = useGetStudentReport(parseInt(academic_id || "0"), parseInt(term_id || "0"), parseInt(student_id || "0"));

  useEffect(() => {
    if (!isReportFetched) return;
    const docInstance = new jsPDF('l', 'mm', 'legal');
    const pageWidth = docInstance.internal.pageSize.width;

    const writePage = (doc: jsPDF) => {
      const headerText = 'LAPORAN HASIL BELAJAR SISWA';
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      const textWidth = doc.getTextWidth(headerText);
      const xPos = (pageWidth - textWidth) / 2;
      doc.text(headerText, xPos, 15);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      let startY = 23;
      const lineHeight = 6;

      const lines = [
        { label: 'Nama Siswa', value: `${reportData?.data?.name}`, align: "left" },
        { label: 'Nomor Induk Siswa', value: `${reportData?.data?.nis}`, align: "left" },
        { label: 'Kelas', value: `${reportData?.data?.class}`, align: "right" },
        { label: 'Tahun Pelajaran', value: `${reportData?.data?.academic_year}`, align: "right" },
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

      const academicData: { no: number; subject: string; score: number, description: string }[] = [];
      reportData?.data?.grades.forEach((grade, index) => {
        academicData.push({
          no: index + 1,
          subject: grade.subject,
          score: grade.finals,
          description: grade.remarks,
        })
      });
      const rowTotal = reportData?.data?.grades.length || 1;
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
          fontSize: 9,
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
          item.score,
          item.score,
          item.score,
          item.score,
          item.score,
          item.score,
          item.score,
          item.score,
          item.score,
        ]),
        styles: {
          fillColor: "#fff",
          fontSize: 9,
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
        startY: (rowTotal + 3) * 7.175 + 33,
        tableWidth: "wrap",
        margin: { left: 10, right: 10 },
        body: [
          [
            {content: "D\nA\nT\nA", rowSpan: 6},
            {content: "Kepribadian", rowSpan: 3},
            "Kelakuan", "A", "A", "A", "A",
          ],
          ["Kerajian", "A", "A", "A", "A"],
          ["Kerapian", "A", "A", "A", "A"],
          [
            {content: "Ketidakhadiran", rowSpan: 3},
            "Sakit", "0", "0", "0", "0"
          ],
          ["Izin", "0", "0", "0", "0"],
          ["Tanpa Keterangan", "0", "0", "0", "0"],
        ],
        styles: {
          fillColor: "#fff",
          fontSize: 9,
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
      doc.text("KBM: Ketuntasan Belajar Minimal, P: Pengetahuan, K: Keterampilan", 10, (rowTotal + 9) * 7.175 + 37);
      const dateStr = new Date().toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
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
          ["Catatan: ", {content: `Medan, ${dateStr}`, colSpan: 2, styles: { halign: "right" }}],
          [
            {content:"_____________________", styles: { halign: "center", valign: "bottom" }},
            {content: "Wali Kelas,", styles: { halign: "center" }},
            {content: "Orang Tua/Wali,", styles: { halign: "center" }},
          ],
          [
            {content:"_____________________", styles: { halign: "center", valign: "bottom" }},
            "", ""
          ],
          [
            {content:"_____________________", styles: { halign: "center", valign: "bottom" }},
            "", ""
          ],
          [
            {content:"_____________________", styles: { halign: "center", valign: "bottom" }},
            {content: `${reportData?.data?.home_room_teacher}`, styles: { halign: "center" }},
            {content: "____________", styles: { halign: "center" }},
          ],
          ["", "", ""],
          ["Catatan: ", {content: `Medan, ${dateStr}`, colSpan: 2, styles: { halign: "right" }}],
          [
            {content:"_____________________", styles: { halign: "center", valign: "bottom" }},
            {content: "Wali Kelas,", styles: { halign: "center" }},
            {content: "Orang Tua/Wali,", styles: { halign: "center" }},
          ],
          [
            {content:"_____________________", styles: { halign: "center", valign: "bottom" }},
            "", ""
          ],
          [
            {content:"_____________________", styles: { halign: "center", valign: "bottom" }},
            "", ""
          ],
          [
            {content:"_____________________", styles: { halign: "center", valign: "bottom" }},
            {content: `${reportData?.data?.home_room_teacher}`, styles: { halign: "center" }},
            {content: "____________", styles: { halign: "center" }},
          ],
          ["", "", ""],
          ["Catatan: ", {content: `Medan, ${dateStr}`, colSpan: 2, styles: { halign: "right" }}],
          [
            {content:"_____________________", styles: { halign: "center", valign: "bottom" }},
            {content: "Wali Kelas,", styles: { halign: "center" }},
            {content: "Orang Tua/Wali,", styles: { halign: "center" }},
          ],
          [
            {content:"_____________________", styles: { halign: "center", valign: "bottom" }},
            "", ""
          ],
          [
            {content:"_____________________", styles: { halign: "center", valign: "bottom" }},
            "", ""
          ],
          [
            {content:"_____________________", styles: { halign: "center", valign: "bottom" }},
            {content: `${reportData?.data?.home_room_teacher}`, styles: { halign: "center" }},
            {content: "____________", styles: { halign: "center" }},
          ],
          ["", "", ""],
          ["Catatan: ", {content: `Medan, ${dateStr}`, colSpan: 2, styles: { halign: "right" }}],
          [
            {content:"_____________________", styles: { halign: "center", valign: "bottom" }},
            {content: "Wali Kelas,", styles: { halign: "center" }},
            {content: "Orang Tua/Wali,", styles: { halign: "center" }},
          ],
          [
            {content:"_____________________", styles: { halign: "center", valign: "bottom" }},
            "", ""
          ],
          [
            {content:"_____________________", styles: { halign: "center", valign: "bottom" }},
            "", ""
          ],
          [
            {content:"_____________________", styles: { halign: "center", valign: "bottom" }},
            {content: `${reportData?.data?.home_room_teacher}`, styles: { halign: "center" }},
            {content: "____________", styles: { halign: "center" }},
          ],
          ["", "", ""],
        ],
        styles: {
          fillColor: "#fff",
          fontSize: 7.575,
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
        didDrawCell: (data) => {
          const MAX_HEIGHT = 5;
          if (data.cell.height > MAX_HEIGHT) {
            data.cell.height = MAX_HEIGHT;
          }
        },
      });
    };

    writePage(docInstance);

    const pdfBlob = docInstance.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);

    setPdfPreview(pdfUrl);

    doc.current = docInstance;

    return () => {
      if (pdfPreview) {
        URL.revokeObjectURL(pdfPreview);
      }
    };
  }, [isReportFetched]);

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
