import { useState } from "react";
import { usePaginationModel } from "../../hooks/use-pagination-model";
import SubjectTable from "./components/SubjectTable";
import AddSubjectModal from "./components/AddSubjectModal";
import { usePermissionAccess } from "../../hooks/useAccessRight";
import FilterTable from "./components/FilterTable";

export default function () {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [type, setType] = useState<string>("");
  const paginationModel = usePaginationModel({});
  const { getPermissionAccess } = usePermissionAccess();

  function handleSubmit(search: string, type: string) {
    setSearch(search);
    setType(type);
    paginationModel.onChangePageValue(1);
  }

  return (
    <div className="flex flex-col gap-5">
      <AddSubjectModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      <FilterTable
        onSearch={handleSubmit}
        buttonText="Tambah Mata Pelajaran"
        buttonOnClick={() => setIsAddModalOpen(true)}
        hideButton={!getPermissionAccess("subject").write}
      />
      <SubjectTable 
        search={search} 
        type={type}
        paginationModel={paginationModel} 
      />
    </div>
  );
}
