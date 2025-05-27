import { useState } from "react";
import SearchTableLayout from "../../components/SearchTableLayout";
import { usePaginationModel } from "../../hooks/use-pagination-model";
import TeacherTable from "./components/TeacherTable";
import TeacherModal from "./components/TeacherModal";
import { TeacherModel } from "../../api-hooks/teacher/models/TeacherModel";

export default function() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const paginationModel = usePaginationModel({});
  const [editData, setEditData] = useState<TeacherModel | null>(null);

  const handleSubmit = (search: string) => {
    setSearch(search);
    paginationModel.onChangePageValue(1);
  }

  function handleEditTeacher(data: any) {
    setIsModalOpen(true);
    setEditData(data);
  }

  return (
    <div className="flex flex-col gap-5">
      <TeacherModal editData={editData} isOpen={isModalOpen} onClose={() => {setIsModalOpen(false); setEditData(null)}} />
      <SearchTableLayout 
        onSearch={handleSubmit}
        buttonText="Tambah Guru"
        buttonOnClick={() => setIsModalOpen(true)}
      />
      <TeacherTable handleEditTeacher={handleEditTeacher} paginationModel={paginationModel} search={search} />
    </div>
  )
}