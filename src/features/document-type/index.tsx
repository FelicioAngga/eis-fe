import { useState } from "react";
import { usePaginationModel } from "../../hooks/use-pagination-model";
import SearchTableLayout from "../../components/SearchTableLayout";
import DocumentTypeTable from "./components/DocumentTypeTable";
import AddDocTypeModal from "./components/AddDocTypeModal";
import { usePermissionAccess } from "../../hooks/useAccessRight";

export default function DocumentType() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const paginationModel = usePaginationModel({});
  const { getPermissionAccess } = usePermissionAccess();

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
        hideButton={!getPermissionAccess("doctype").write}
      />
      <DocumentTypeTable paginationModel={paginationModel} search={search} />
    </div>
  )
}