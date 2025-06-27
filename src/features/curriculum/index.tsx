import { useState } from "react";
import { usePaginationModel } from "../../hooks/use-pagination-model";
import SearchTableLayout from "../../components/SearchTableLayout";
import CurriculumModal from "./components/CurriculumModal";
import CurriculumTable from "./components/CurriculumTable";
import { usePermissionAccess } from "../../hooks/useAccessRight";

function Curriculum() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const paginationModel = usePaginationModel({});
  const [curriculumId, setCurriculumId] = useState<number | null>(null);
  const { getPermissionAccess } = usePermissionAccess();

  function handleSubmit(search: string) {
    setSearch(search);
    paginationModel.onChangePageValue(1);
  }

  const handleEditCurriculum = (id: number) => {
    setCurriculumId(id);
    setIsModalOpen(true);
  }

  return (
    <div className="flex flex-col gap-5">
      <CurriculumModal curriculumId={curriculumId} isOpen={isModalOpen} onClose={() => {setIsModalOpen(false); setCurriculumId(null)}} />
      <SearchTableLayout 
        onSearch={handleSubmit}
        buttonText="Tambah Kurikulum"
        buttonOnClick={() => setIsModalOpen(true)}
        hideButton={!getPermissionAccess("curriculum").write}
      />
      <CurriculumTable handleEditCurriculum={handleEditCurriculum} search={search} paginationModel={paginationModel} />
    </div>
  );
}

export default Curriculum