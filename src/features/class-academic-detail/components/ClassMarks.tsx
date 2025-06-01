import { useDispatch } from "react-redux";
import Button from "../../../components/Button";
import { changeActiveMenu } from "../classAcademicSlice";
import { FiEdit } from "react-icons/fi";
import React, { useState } from "react";
import ClassMarksModal from "./ClassMarksModal";

function ClassMarks() {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  }

  const handleBack = () => {
    dispatch(changeActiveMenu(""));
  };

  return (
    <div>
      <ClassMarksModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <div className="flex justify-between">
        <div>
          <p className="text-xl font-medium">Data Nilai Siswa</p>
          <table className="font-medium mt-5">
            <tbody>
              <tr>
                <td className="pr-8 pb-3">Kelas</td>
                <td className="pr-8 pb-3">:</td>
                <td className="pr-8 pb-3">Kelas 10</td>
              </tr>
              <tr>
                <td className="pr-8 pb-3">Jenjang</td>
                <td className="pr-8 pb-3">:</td>
                <td className="pr-8 pb-3">SMA</td>
              </tr>
              <tr>
                <td className="pr-8 pb-3">Jurusan</td>
                <td className="pr-8 pb-3">:</td>
                <td className="pr-8 pb-3">General</td>
              </tr>
              <tr>
                <td className="pr-8 pb-3">Wali Kelas</td>
                <td className="pr-8 pb-3">:</td>
                <td className="pr-8 pb-3">Budman</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="flex gap-5">
          <Button>Import</Button>
          <Button variant="outline" onClick={handleBack}>Batal</Button>
        </div>
      </div>

      <div className="overflow-x-auto w-full">
        <table className="mt-5 w-full min-w-max font-medium text-sm">
          <tbody>
            <tr>
              <td className="border border-gray-400 px-3 py-2">No</td>
              <td className="border border-gray-400 px-3 py-2">NIS</td>
              <td className="border border-gray-400 px-3 py-2">Nama Lengkap</td>
              <td className="border border-gray-400 px-3 py-2">Nilai</td>
              {Array.from({ length: 5 }, (_, i) => (
                <React.Fragment key={i}>
                  <td key={i} className="border border-gray-400 px-3 py-2">Bahasa Inggris</td>
                  <td className="border border-gray-400 px-3 py-2">Aksi</td>
                </React.Fragment>
              ))}
            </tr> 

            <tr>
              <td rowSpan={6} className="border border-gray-400 px-3 py-2">1</td>
              <td rowSpan={6} className="border border-gray-400 px-3 py-2">123123</td>
              <td rowSpan={6} className="border border-gray-400 px-3 py-2">Felicio</td>
            </tr>
            <tr>
              <td className="border border-gray-400 px-3 py-2">Tugas</td>
              {Array.from({ length: 5 }, (_, i) => (
                <React.Fragment key={i}>
                  <td className="border border-gray-400 px-3 py-2"></td>
                  <td rowSpan={6} className="border border-gray-400 px-3 py-2">
                    <FiEdit onClick={openModal} className="mx-auto cursor-pointer size-5" />
                  </td>
                </React.Fragment>
              ))}
            </tr>
            <tr>
              <td className="border border-gray-400 px-3 py-2">Ujian Bulanan 1</td>
              {Array.from({ length: 5 }, (_, i) => (
                <React.Fragment key={i}>
                  <td className="border border-gray-400 px-3 py-2"></td>
                </React.Fragment>
              ))}
            </tr>
            <tr>
              <td className="border border-gray-400 px-3 py-2">UTS</td>
              {Array.from({ length: 5 }, (_, i) => (
                <React.Fragment key={i}>
                  <td className="border border-gray-400 px-3 py-2"></td>
                </React.Fragment>
              ))} 
            </tr>
            <tr>
              <td className="border border-gray-400 px-3 py-2">Ujian Bulanan 2</td>
              {Array.from({ length: 5 }, (_, i) => (
                <React.Fragment key={i}>
                  <td className="border border-gray-400 px-3 py-2"></td>
                </React.Fragment>
              ))} 
            </tr>
            <tr>
              <td className="border border-gray-400 px-3 py-2">UAS</td>
              {Array.from({ length: 5 }, (_, i) => (
                <React.Fragment key={i}>
                  <td className="border border-gray-400 px-3 py-2"></td>
                </React.Fragment>
              ))} 
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ClassMarks;
