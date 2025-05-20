import { useState } from "react";
import { usePaginationModel } from "../../hooks/use-pagination-model";
import SearchTableLayout from "../../components/SearchTableLayout";

export default function() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const paginationModel = usePaginationModel({});

  function handleSubmit(search: string) {
    setSearch(search);
    paginationModel.onChangePageValue(1);
  }

  return (
    <div>
      <SearchTableLayout 
        onSearch={handleSubmit}
        buttonText="Tambah Tipe"
        buttonOnClick={() => setIsAddModalOpen(true)}
      />
      
    </div>
  )
}