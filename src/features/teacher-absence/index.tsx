import { useState } from "react";
import { usePaginationModel } from "../../hooks/use-pagination-model";
import TeacherAbsenceModal from "./components/TeacherAbsenceModal";
import TeacherAbsenceTable from "./components/TeacherAbsenceTable";
import FilterTable from "./components/FilterTable";
import { TeacherAbsenceCreateModel } from "../../api-hooks/teacher-absence/models/TeacherAbsenceModel";
import TeacherAbsenceImportModal from "./components/TeacherAbsenceImportModal";

export default function() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [search, setSearch] = useState({ name: "", date: "" });
  const paginationModel = usePaginationModel({});
  const [editData, setEditData] = useState<TeacherAbsenceCreateModel | null>(null);

  function handleSubmit(search: { name: string; date: string }) {
    setSearch(search);
    paginationModel.onChangePageValue(1);
  }

  function handleEdit(data: TeacherAbsenceCreateModel) {
    setEditData(data);
    setIsModalOpen(true);
  }

  return (
    <div className="flex flex-col gap-5">
      <TeacherAbsenceModal editData={editData} isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditData(null) }} />
      <TeacherAbsenceImportModal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} />
      <FilterTable 
        onSearch={handleSubmit}
        buttonText="Tambah Absensi"
        buttonOnClick={() => setIsModalOpen(true)}
        importButtonOnClick={() => setIsImportModalOpen(true)} 
      />
      <TeacherAbsenceTable search={search} paginationModel={paginationModel} handleEdit={handleEdit} />
    </div>
  );
}