import { useState } from "react";
import SearchTableLayout from "../../components/SearchTableLayout";
import { usePaginationModel } from "../../hooks/use-pagination-model";
import { WorkingScheduleModel } from "../../api-hooks/working-schedule/models/WorkingScheduleModel";
import WorkingScheduleModal from "./components/WorkingScheduleModal";
import WorkingScheduleTable from "./components/WorkingScheduleTable";

export default function() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const paginationModel = usePaginationModel({});
  const [editData, setEditData] = useState<WorkingScheduleModel | null>(null);

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
      <WorkingScheduleModal editData={editData} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <SearchTableLayout 
        onSearch={handleSubmit}
        buttonText="Tambah Jadwal"
        buttonOnClick={() => setIsModalOpen(true)}
      />
      <WorkingScheduleTable handleEditTeacher={handleEditTeacher} paginationModel={paginationModel} search={search} />
    </div>
  )
}