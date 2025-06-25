import { useState } from "react";
import { usePaginationModel } from "../../hooks/use-pagination-model";
import SearchTableLayout from "../../components/SearchTableLayout";
import CurriculumModal from "./components/CurriculumModal";
import CurriculumTable from "./components/CurriculumTable";

function Curriculum() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const paginationModel = usePaginationModel({});

  function handleSubmit(search: string) {
    setSearch(search);
    paginationModel.onChangePageValue(1);
  }

  return (
    <div className="flex flex-col gap-5">
      <CurriculumModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <SearchTableLayout 
        onSearch={handleSubmit}
        buttonText="Tambah Kurikulum"
        buttonOnClick={() => setIsModalOpen(true)}
      />
      <CurriculumTable search={search} paginationModel={paginationModel} />
    </div>
  );
}

export default Curriculum