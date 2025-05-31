import { FiPrinter } from "react-icons/fi";
import Button from "../../../components/Button";
import Checkbox from "../../../components/Checkbox";


function ClassAcademicTable() {
  return (
    <div className="border p-3 rounded-lg border-gray-300">
      <div className="flex items-center justify-between">
        <p className="font-semibold text-lg">Data Siswa</p>
        <Button>Pindah Kelas</Button>
      </div>

      <div className="mt-5 font-medium text-sm flex py-3 border border-gray-300 bg-gray-100">
        <div className="w-1/12 flex justify-center">
          <Checkbox />
        </div>
        <div className="w-1/12">No</div>
        <div className="w-5/12">Nama Lengkap</div>
        <div className="w-2/12">NISN</div>
        <div className="w-2/12">NIS</div>
        <div className="w-2/12">Cetak Rapor</div>
      </div>

      <div className="font-medium text-sm flex py-3 border-b border-r border-l border-gray-300">
        <div className="w-1/12 flex justify-center">
          <Checkbox />
        </div>
        <div className="w-1/12">1</div>
        <div className="w-5/12">Tes Hantu</div>
        <div className="w-2/12">048651456</div>
        <div className="w-2/12">4656312</div>
        <div className="w-2/12 text-lg"><FiPrinter className="cursor-pointer" /></div>
      </div>
    </div>
  )
}

export default ClassAcademicTable;
