import { useState } from "react";
import { usePaginationModel } from "../../hooks/use-pagination-model";
import AccessRightModal from "./components/AccessRightModal";
import SearchTableLayout from "../../components/SearchTableLayout";
import AccessRightTable from "./components/AccessRightTable";

export default function() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const paginationModel = usePaginationModel({});

  function handleSubmit(search: string) {
    setSearch(search);
    paginationModel.onChangePageValue(1);
  }

  function handleEdit(id: number) {
    setIsModalOpen(true);
    setEditId(id);
  }

  return (
    <div className="flex flex-col gap-5">
      <AccessRightModal editId={editId} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <SearchTableLayout 
        onSearch={handleSubmit}
        buttonText="Tambah Role"
        buttonOnClick={() => setIsModalOpen(true)}
      />
      <AccessRightTable search={search} paginationModel={paginationModel} handleEdit={handleEdit} />
    </div>
  );
}