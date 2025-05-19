import { useState } from "react";
import { usePaginationModel } from "../../hooks/use-pagination-model";
import SearchTableLayout from "../../components/SearchTableLayout";
import SubjectTable from "./components/SubjectTable";
import AddSubjectModal from "./components/AddSubjectModal";

export default function () {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const paginationModel = usePaginationModel({});

  function handleSubmit(search: string) {
    setSearch(search);
    paginationModel.onChangePageValue(1);
  }

  return (
    <div className="flex flex-col gap-5">
      <AddSubjectModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      <SearchTableLayout 
        onSearch={handleSubmit}
        buttonText="Tambah Mata Pelajaran"
        buttonOnClick={() => setIsAddModalOpen(true)}
      />
      <SubjectTable search={search} paginationModel={paginationModel} />
    </div>
  );
}
