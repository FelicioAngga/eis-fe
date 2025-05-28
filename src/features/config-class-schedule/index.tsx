import { useState } from "react";
import { usePaginationModel } from "../../hooks/use-pagination-model";
import SearchTableLayout from "../../components/SearchTableLayout";
import ConfigClassScheduleTable from "./components/ConfigClassScheduleTable";

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
      <ConfigClassScheduleTable search={search} paginationModel={paginationModel} />
    </div>
  );
}