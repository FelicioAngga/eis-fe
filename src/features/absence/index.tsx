import { useState } from "react";
import SearchTableLayout from "../../components/SearchTableLayout";
import { usePaginationModel } from "../../hooks/use-pagination-model";
import ClassTable from "./components/AbsenceTable";

export default function() {
  const [search, setSearch] = useState("");
  const paginationModel = usePaginationModel({});

  function handleSubmit(search: string) {
    setSearch(search);
    paginationModel.onChangePageValue(1);
  }

  return (
    <div className="flex flex-col gap-5">
      <SearchTableLayout 
        onSearch={handleSubmit}
        hideButton
      />
      <ClassTable search={search} paginationModel={paginationModel} />
    </div>
  )
}