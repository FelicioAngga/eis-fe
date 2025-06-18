import { useState } from "react";
import { usePaginationModel } from "../../hooks/use-pagination-model";
import ClassTable from "./components/ClassTable";
import BatchModal from "./components/BatchModal";
import { FiSearch } from "react-icons/fi";
import ManualAcademicModal from "./components/ManualAcademicModal";
import Button from "../../components/Button";
import { useAuth } from "../../hooks/useAuth";

export default function Classes() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const paginationModel = usePaginationModel({});
  const { getUser } = useAuth();

  function handleSubmit(search: string) {
    setSearch(search);
    paginationModel.onChangePageValue(1);
  }

  return (
    <div className="flex flex-col gap-5">
      <BatchModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      <ManualAcademicModal isOpen={isManualModalOpen} onClose={() => setIsManualModalOpen(false)} />
      <div className="flex gap-3 items-center justify-between">
        <div className="flex gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Enter untuk mencari"
              className="border border-gray-400 rounded-md pl-8 py-2 w-xs"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit(search);
              }}
            />
            <FiSearch className="absolute top-2.5 left-2 text-xl text-gray-400" />
          </div>
          <Button onClick={() => handleSubmit(search)}>Cari</Button>
        </div>
        <div className="flex gap-4">
          {getUser()?.role_name === "Admin" && (
            <>
              <Button onClick={() => setIsManualModalOpen(true)} className="h-full">Tambah Tahun Ajar Kelas</Button>
              <Button onClick={() => setIsAddModalOpen(true)} className="h-full">Tambah Batch Tahun Ajar</Button>
            </>
          )}
        </div>
      </div>
      <ClassTable search={search} paginationModel={paginationModel} />
    </div>
  );
}