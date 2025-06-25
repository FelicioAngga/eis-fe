import letjenLogo from "../../../assets/images/letjen-logo.png"
import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useGetStudentReport } from "../../../api-hooks/student-grades/api";

import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";

function PrintStudentReport() {
  const [pdfPreview, setPdfPreview] = useState<string | null>(null);
  const iframeRef = useRef(null);
  const doc = useRef<jsPDF | null>(null);

  const { student_id, academic_id, term_id } = useParams();
  const studentIds = student_id ? student_id.split(',').map((id) => parseInt(id)) : [];
  const { data: reportDatas, isFetched: isReportFetched } = useGetStudentReport(parseInt(academic_id || "0"), parseInt(term_id || "0"), studentIds);

  useEffect(() => {
    if (!isReportFetched || (reportDatas?.data?.length || 0) < 1) return;
    const docInstance = new jsPDF('p', 'mm', 'a4');
    const pageWidth = docInstance.internal.pageSize.width;
    
    reportDatas?.data.forEach((reportData, index) => {
      const addHeader = (doc: jsPDF) => {
        const headerText = 'LAPORAN HASIL BELAJAR';
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(12);
        const textWidth = doc.getTextWidth(headerText);
        const xPos = (pageWidth - textWidth) / 2;
        doc.text(headerText, xPos, 12);
        const lineY = 13;
        const lineStartX = xPos;
        const lineEndX = xPos + textWidth;

        doc.setLineWidth(0.5);
        doc.line(lineStartX, lineY, lineEndX, lineY);
        doc.addImage(letjenLogo, 'JPEG', 5, 5, 30, 30);

        doc.setFontSize(10);
        let startY = 20;
        const lineHeight = 4;

        const lines = [
          { label: 'Nama', value: `${reportData?.name}`, align: "left" },
          { label: 'NIS/NISN', value: `${reportData?.nis}/${reportData?.nisn}`, align: "left" },
          { label: 'Nama Sekolah', value: `${reportData?.level} LETJEN HARYONO M.T.`, align: "left" },
          { label: 'Alamat', value: 'Jl. Pinang Baris II Gg Sekata', align: "left" },
          { label: 'Kelas', value: `${reportData?.class}`, align: "right" },
          { label: 'Fase', value: `${reportData?.fase}`, align: "right" },
          { label: 'Semester', value: `${reportData?.term}`, align: "right" },
          { label: 'Tahun Pelajaran', value: `${reportData?.academic_year}`, align: "right" },
        ];

        lines.forEach((line, index) => {
          const labelX = line.align === "left" ? 37 : 147;
          const valueX = line.align === "left" ? 68 : 178;
          const yOffset = startY + (index % 4) * lineHeight;
          doc.text(line.label, labelX , yOffset);

          doc.text(`: ${line.value}`, valueX , yOffset);
        });

        doc.setLineWidth(0.5);
        doc.line(10, 35, 200, 35);
      };

      const getPage1 = (doc: jsPDF) => {
        const academicData: { no: number; subject: string; score: number, description: string }[] = [];
        reportData?.grades.forEach((grade, index) => {
          academicData.push({
            no: index + 1,
            subject: grade.subject,
            score: grade.finals,
            description: grade.remarks,
          })
        })
        const rowTotal = reportData?.grades.length || 1;
        autoTable(doc, {
          startY: 40,
          margin: { left: 10, right: 10 },
          head: [["No", "Mata Pelajaran", "Nilai Akhir", "Capaian Kompetensi"]],
          body: academicData.map((item) => [
            item.no,
            item.subject,
            item.score,
            item.description,
          ]),
          styles: {
            fontSize: 9,
            cellPadding: 1.5,
            overflow: "linebreak",
            valign: "middle",
            lineWidth: 0.1,
            lineColor: "#000",
            textColor: "#000",
            minCellHeight: Math.floor(237 / rowTotal),
          },
          headStyles: {
            fillColor: [200, 200, 200],
            textColor: 0,
            fontSize: 9,
            halign: "center",
            valign: "middle",
            minCellHeight: 10,
          },
          columnStyles: {
            0: { cellWidth: 8, halign: "center" },
            1: { cellWidth: 50 },
            2: { cellWidth: 15, halign: "center" },
            3: { cellWidth: 117 },
          },
          pageBreak: "avoid",
          didDrawPage: () => {
            addHeader(doc);
          },
        });
      };

      const getPage2 = (doc: jsPDF) => {
        addHeader(doc);
        doc.setFont("helvetica", "bold");
        doc.text("Ekstrakurikuler", 15, 46);
        autoTable(doc, {
          startY: 48,
          margin: { left: 10, right: 10 },
          head: [["No", "Kegiatan Ekstrakurikuler", "Predikat"]],
          body: reportData?.extracurriculars.map((item, index) => [
            index + 1,
            item.name,
            item.score,
          ]) || [],
          styles: {
            fontSize: 9,
            cellPadding: 1.5,
            overflow: "linebreak",
            valign: "middle",
            lineWidth: 0.1,
            lineColor: "#000",
            textColor: "#000",
            minCellHeight: 10,
          },
          headStyles: {
            fillColor: [200, 200, 200],
            textColor: 0,
            fontSize: 9,
            halign: "center",
            valign: "middle",
            minCellHeight: 5,
          },
          columnStyles: {
            0: { cellWidth: 8, halign: "center" },
            1: { cellWidth: 50 },
            2: { cellWidth: 20, halign: "center" },
          },
          pageBreak: "avoid",
        });
        autoTable(doc, {
          startY: 93,
          tableWidth: "wrap",
          margin: { left: 10, right: 10 },
          tableLineColor: "#000",
          tableLineWidth: 0.1,
          head: [[
            { content: "Ketidakhadiran", colSpan: 5, styles: { lineWidth: { top: 0.1, bottom: 0.2, left: 0.1, right: 0.1 } } }
          ]],
          body: [
            ["", "Sakit", ":", `${reportData?.sick || '-'}`, "Hari"],
            ["", "Izin", ":", `${reportData?.permission || '-'}`, "Hari"],
            ["", "Tanpa Keterangan", ":", `${reportData?.absent || '-'}`, "Hari"],
          ],
          styles: {
            fontSize: 9,
            cellPadding: 1.5,
            overflow: "linebreak",
            halign: "center",
            valign: "middle",
            textColor: "#000",
            minCellHeight: 10,
          },
          headStyles: {
            fillColor: [200, 200, 200],
            textColor: 0,
            fontSize: 9,
            halign: "center",
            valign: "middle",
            minCellHeight: 5,
            fontStyle: "bold",
          },
          columnStyles: {
            0: { cellWidth: 8 },
            1: { cellWidth: 22 },
            2: { cellWidth: 5 },
            3: { cellWidth: 23 },
            4: { cellWidth: 20 },
          },
          pageBreak: "avoid",
        });
        const catatanY = 138;
        doc.setFontSize(10);
        doc.text("Catatan Wali Kelas", 10, catatanY);
        doc.setFont("helvetica", "normal");
        doc.setDrawColor(0);
        doc.setLineWidth(0.2);
        doc.rect(10, catatanY + 2, 190, 30);

        const ttdY = catatanY + 40;
        const dateStr = new Date().toLocaleDateString('id-ID', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });

        doc.text(`Medan, ${dateStr}`, 150, ttdY);

        doc.text("Mengetahui,", 15, ttdY);
        doc.text("Orang Tua / Wali", 15, ttdY + 6);
        doc.text("Wali Kelas", 90, ttdY + 6);
        doc.text(`Kepala ${reportData?.level}`, 150, ttdY + 6);
        
        doc.text(`${reportData?.home_room_teacher}`, 90, ttdY + 29);
        doc.text(`${reportData?.principal}`, 150, ttdY + 29);

        doc.line(15, ttdY + 30, 55, ttdY + 30);
        doc.line(90, ttdY + 30, 130, ttdY + 30);
        doc.line(150, ttdY + 30, 190, ttdY + 30);
      };
      const generateReport = (doc: jsPDF) => {
        const pageGenerators = [getPage1, getPage2];

        pageGenerators.forEach((genFn, index) => {
          if (index > 0) {
            doc.addPage();
          }
          genFn(doc);
        });
      };

      generateReport(docInstance);
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

export default PrintStudentReport;
