import { useState } from "react";
import { usePaginationModel } from "../../hooks/use-pagination-model";
import SearchTableLayout from "../../components/SearchTableLayout";
import ClassTable from "./components/ClassTable";
import BatchModal from "./components/BatchModal";

export default function() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const paginationModel = usePaginationModel({});

  function handleSubmit(search: string) {
    setSearch(search);
    paginationModel.onChangePageValue(1);
  }

  return (
    <div className="flex flex-col gap-5">
      <BatchModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      <SearchTableLayout 
        onSearch={handleSubmit}
        buttonText="Tambah Batch Tahun Ajaran"
        buttonOnClick={() => setIsAddModalOpen(true)}
      />
      <ClassTable search={search} paginationModel={paginationModel} />
    </div>
  );
}