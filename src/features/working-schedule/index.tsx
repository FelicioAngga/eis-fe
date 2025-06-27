import { useState } from "react";
import SearchTableLayout from "../../components/SearchTableLayout";
import { usePaginationModel } from "../../hooks/use-pagination-model";
import { WorkingScheduleModel } from "../../api-hooks/working-schedule/models/WorkingScheduleModel";
import WorkingScheduleModal from "./components/WorkingScheduleModal";
import WorkingScheduleTable from "./components/WorkingScheduleTable";
import { usePermissionAccess } from "../../hooks/useAccessRight";

export default function() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const paginationModel = usePaginationModel({});
  const [editData, setEditData] = useState<WorkingScheduleModel | null>(null);
  const { getPermissionAccess } = usePermissionAccess();

  const handleSubmit = (search: string) => {
    setSearch(search);
    paginationModel.onChangePageValue(1);
  }

  function handleEditWorkScheds(data: any) {
    setIsModalOpen(true);
    setEditData(data);
  }

  return (
    <div className="flex flex-col gap-5">
      <WorkingScheduleModal setEditData={setEditData} editData={editData} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <SearchTableLayout 
        onSearch={handleSubmit}
        hideButton={!getPermissionAccess("worksched").write}
        buttonText="Tambah Jadwal"
        buttonOnClick={() => setIsModalOpen(true)}
        hideInput={!getPermissionAccess("worksched").write}
      />
      <WorkingScheduleTable handleEditWorkScheds={handleEditWorkScheds} paginationModel={paginationModel} search={search} />
    </div>
  )
}

