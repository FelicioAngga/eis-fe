import { useState } from "react";
import { usePaginationModel } from "../../hooks/use-pagination-model";
import ConfigClassModal from "./components/ConfigClassModal";
import SearchTableLayout from "../../components/SearchTableLayout";
import ConfigClassTable from "./components/ConfigClassTable";
import { ConfigClassModel } from "../../api-hooks/config-class/models/ConfigClassModel";

export default function() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [editData, setEditData] = useState<ConfigClassModel | null>(null);
  const paginationModel = usePaginationModel({});

  function handleSubmit(search: string) {
    setSearch(search);
    paginationModel.onChangePageValue(1);
  }

  function handleEdit(data: ConfigClassModel) {
    setIsModalOpen(true);
    setEditData(data);
  }

  return (
    <div className="flex flex-col gap-5">
      <ConfigClassModal editData={editData} isOpen={isModalOpen} onClose={() => {setEditData(null); setIsModalOpen(false);}} />
      <SearchTableLayout 
        onSearch={handleSubmit}
        buttonText="Tambah Kelas"
        buttonOnClick={() => setIsModalOpen(true)}
      />
      <ConfigClassTable search={search} paginationModel={paginationModel} handleEdit={handleEdit} />
    </div>
  );
}