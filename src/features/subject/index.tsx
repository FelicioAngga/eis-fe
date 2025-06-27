import { useState } from "react";
import { usePaginationModel } from "../../hooks/use-pagination-model";
import SearchTableLayout from "../../components/SearchTableLayout";
import SubjectTable from "./components/SubjectTable";
import AddSubjectModal from "./components/AddSubjectModal";
import { usePermissionAccess } from "../../hooks/useAccessRight";

export default function () {
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
      <AddSubjectModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      <SearchTableLayout 
        onSearch={handleSubmit}
        buttonText="Tambah Mata Pelajaran"
        buttonOnClick={() => setIsAddModalOpen(true)}
        hideButton={!getPermissionAccess("subject").write}
      />
      <SubjectTable search={search} paginationModel={paginationModel} />
    </div>
  );
}
