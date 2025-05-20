import { useState } from "react";
import { usePaginationModel } from "../../hooks/use-pagination-model";
import SearchTableLayout from "../../components/SearchTableLayout";
import DocumentTypeTable from "./components/DocumentTypeTable";
import AddDocTypeModal from "./components/AddDocTypeModal";

export default function DocumentType() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const paginationModel = usePaginationModel({});

  function handleSubmit(search: string) {
    setSearch(search);
    paginationModel.onChangePageValue(1);
  }

  return (
    <div className="flex flex-col gap-5">
      <AddDocTypeModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      <SearchTableLayout 
        onSearch={handleSubmit}
        buttonText="Tambah Tipe"
        buttonOnClick={() => setIsAddModalOpen(true)}
      />
      <DocumentTypeTable paginationModel={paginationModel} search={search} />
    </div>
  )
}