import { useState } from "react";
import SearchTableLayout from "../../components/SearchTableLayout";
import { usePaginationModel } from "../../hooks/use-pagination-model";
import ClassNoteTable from "./components/ClassNoteTable";
import { useAuth } from "../../hooks/useAuth";
import TeacherClassNote from "../class-note-detail/components/TeacherClassNote";

export default function() {
  const [search, setSearch] = useState("");
  const paginationModel = usePaginationModel({});
  const { getUser } = useAuth();
  
  function handleSubmit(search: string) {
    setSearch(search);
    paginationModel.onChangePageValue(1);
  }

  if (getUser()?.role_name?.toLowerCase() === "teacher") return <TeacherClassNote />
  return (
    <div className="flex flex-col gap-5">
      <p className="font-medium text-xl">Catatan Kelas</p>
      <SearchTableLayout 
        onSearch={handleSubmit}
        hideButton
      />
      <ClassNoteTable search={search} paginationModel={paginationModel} />
    </div>
  )
}