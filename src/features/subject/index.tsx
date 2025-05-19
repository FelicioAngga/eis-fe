import { useState } from "react";
import { usePaginationModel } from "../../hooks/use-pagination-model";
import SearchTableLayout from "../../components/SearchTableLayout";
import SubjectTable from "./components/SubjectTable";

export default function () {
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
        buttonText="Tambah Mata Pelajaran"
      />
      <SubjectTable search={search} paginationModel={paginationModel} />
    </div>
  );
}
