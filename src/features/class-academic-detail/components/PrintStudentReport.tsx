import Button from "../../../components/Button";
import letjenLogo from "../../../assets/images/letjen-logo.png"
import { BiChevronLeft } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function PrintStudentReport() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAfterPrint = () => {
      window.close();
    };
    window.addEventListener("afterprint", handleAfterPrint);
    window.print();
    return () => {
      window.removeEventListener("afterprint", handleAfterPrint);
    };
  }, [])

  return (
    <div>
      <div
        onClick={() => navigate("/class")}
        className="print:hidden mb-2 transition-all duration-[400ms] flex items-center gap-1 hover:gap-3 text-primary cursor-pointer"
      >
        <BiChevronLeft className="text-2xl" />
        <p className="font-semibold text-sm">Kembali</p>
      </div>
      <div className="flex justify-between items-center mb-5 print:hidden">
        <p className="font-semibold text-lg">Rapor Print Preview</p>
        <Button className="w-24" onClick={() => window.print()}>Cetak</Button>
      </div>

      <p className="text-2xl font-medium mb-4 text-center">Laporan Hasil Belajar</p>
      <div className="flex justify-between">
        <div className="flex gap-5">
          <img src={letjenLogo} className="object-cover size-32" />
          <table className="h-fit font-medium">
            <tbody>
              <tr>
                <td className="pr-5">Nama</td>
                <td className="pr-5">:</td>
                <td className="pr-5">John Doe</td>
              </tr>
              <tr>
                <td className="pr-5">NIS/NISN</td>
                <td className="pr-5">:</td>
                <td className="pr-5">0008465/165486</td>
              </tr>
            </tbody>
          </table>
        </div>

        <table className="h-fit font-medium text-lg">
          <tbody>
            <tr>
              <td className="pr-5">Jenjang</td>
              <td className="pr-5">:</td>
              <td className="pr-5">SMA</td>
            </tr>
            <tr>
              <td className="pr-5">Tingkat</td>
              <td className="pr-5">:</td>
              <td className="pr-5">1</td>
            </tr>
            <tr>
              <td className="pr-5">Kelas</td>
              <td className="pr-5">:</td>
              <td className="pr-5">1</td>
            </tr>
          </tbody>
        </table>
      </div>

      <table className="mt-5">
        <thead>
          <tr className="font-medium">
            <th className="border border-gray-400 px-3 py-4">No</th>
            <th className="text-left border border-gray-400 px-3 py-4 w-2/12">Mata Pelajaran</th>
            <th className="border border-gray-400 px-3 py-4 w-2/12">Nilai Akhir</th>
            <th className="text-left border border-gray-400 px-3 py-4 w-full">Deskripsi</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-400 px-3 py-4 text-center font-medium">1</td>
            <td className="border border-gray-400 px-3 py-4">Matematika</td>
            <td className="text-center border border-gray-400 px-3 py-4">85</td>
            <td className="border border-gray-400 px-3 py-4">Sangat baik dalam memahami konsep matematika dasar.</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default PrintStudentReport;
