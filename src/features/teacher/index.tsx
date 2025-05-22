import { useState } from "react";
import SearchTableLayout from "../../components/SearchTableLayout";
import { usePaginationModel } from "../../hooks/use-pagination-model";
import TeacherTable from "./components/TeacherTable";
import TeacherModal from "./components/TeacherModal";

export default function() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const paginationModel = usePaginationModel({});

  const handleSubmit = (search: string) => {
    setSearch(search);
    paginationModel.onChangePageValue(1);
  }

  function handleEditTeacher(data: any) {

  }

  return (
    <div className="flex flex-col gap-5">
      <TeacherModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <SearchTableLayout 
        onSearch={handleSubmit}
        buttonText="Tambah Guru"
        buttonOnClick={() => setIsModalOpen(true)}
      />
      <TeacherTable handleEditTeacher={handleEditTeacher} paginationModel={paginationModel} search={search} />
    </div>
  )
}