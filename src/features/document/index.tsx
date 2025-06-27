import { useState } from "react";
import { usePaginationModel } from "../../hooks/use-pagination-model";
import DocumentModal from "./components/DocumentModal";
import SearchTableLayout from "../../components/SearchTableLayout";
import DocumentTable from "./components/DocumentTable";
import { DocumentModel } from "../../api-hooks/documents/models/DocumentModel";
import { usePermissionAccess } from "../../hooks/useAccessRight";

export default function() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState<DocumentModel | null>(null);
  const [search, setSearch] = useState("");
  const paginationModel = usePaginationModel({});
  const { getPermissionAccess } = usePermissionAccess();

  function handleSubmit(search: string) {
    setSearch(search);
    paginationModel.onChangePageValue(1);
  }

  function handleEditDocument(document: DocumentModel) {
    setIsModalOpen(true);
    setEditData(document);
  }

  return (
    <div className="flex flex-col gap-5 overflow-hidden">
      <DocumentModal editData={editData} isOpen={isModalOpen} onClose={() => {setIsModalOpen(false); setEditData(null)}} />
      <SearchTableLayout 
        onSearch={handleSubmit}
        buttonText="Tambah Dokumen"
        buttonOnClick={() => setIsModalOpen(true)}
        placeholder="Enter nama atau deskripsi"
        hideButton={!getPermissionAccess("document").write}
      />
      <DocumentTable handleEditDoc={handleEditDocument} paginationModel={paginationModel} search={search} />
    </div>
  )
}