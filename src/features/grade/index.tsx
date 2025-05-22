import { useState } from "react";
import SearchTableLayout from "../../components/SearchTableLayout";
import { usePaginationModel } from "../../hooks/use-pagination-model";
import GradeTable from "./components/GradeTable";
import { GradeModel } from "../../api-hooks/grade/models/GradeModel";
import GradeModal from "./components/GradeModal";

export default function () {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState<GradeModel | null>(null);
  const [search, setSearch] = useState("");
  const paginationModel = usePaginationModel({});

  function handleSubmit(search: string) {
    setSearch(search);
    paginationModel.onChangePageValue(1);
  }

  function handleEdit(data: GradeModel) {
    setEditData(data);
    setIsModalOpen(true);
  }

  return (
    <div className="flex flex-col gap-5">
      <GradeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} editData={editData} />
      <SearchTableLayout onSearch={handleSubmit} hideButton={true} />
      <GradeTable
        handleEdit={handleEdit}
        paginationModel={paginationModel}
        search={search}
      />
    </div>
  );
}
