import { useState } from "react";
import { usePaginationModel } from "../../hooks/use-pagination-model";
import ClassNoteTable from "./components/ClassNoteTable";
import { useAuth } from "../../hooks/useAuth";
import TeacherClassNote from "../class-note-detail/components/TeacherClassNote";
import { YearPicker } from "../../components/YearPicker";
import Button from "../../components/Button";
import { FiSearch } from "react-icons/fi";

export default function ClassNote() {
  const [search, setSearch] = useState("");
  const paginationModel = usePaginationModel({});
  const { getUser } = useAuth();
  const [startYear, setStartYear] = useState<string>(new Date().getFullYear().toString());
  
  function handleSubmit(search: string) {
    setSearch(search);
    paginationModel.onChangePageValue(1);
  }

  if (getUser()?.role_name?.toLowerCase() === "teacher") return <TeacherClassNote />
  return (
    <div className="flex flex-col gap-5">
      <p className="font-medium text-xl">Catatan Kelas</p>
      <div className="flex gap-3 items-center justify-between">
        <div className="flex gap-2">
          <div className="relative">
            <p className="font-medium text-sm mb-1">Nama Akademik</p>
            <input
              type="text"
              placeholder="Enter untuk mencari"
              className="border border-gray-400 rounded-md pl-8 py-2 w-xs"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit(search);
              }}
            />
            <FiSearch className="absolute top-[34px] left-2 text-xl text-gray-400" />
          </div>
          <Button className="mt-auto" onClick={() => handleSubmit(search)}>Cari</Button>
        </div>
        <YearPicker
          name="start_year"
          label="Tahun Ajaran Mulai"
          value={startYear}
          onChange={(year) => setStartYear(year)}
          
        />
        <div className="w-full font-medium text-sm flex flex-col gap-4">
          <p>Tahun Ajaran Selesai</p>
          <p className="mb-2.5">{startYear ? +startYear + 1 : "-"}</p>
        </div>
      </div>
      <ClassNoteTable search={search} paginationModel={paginationModel} academicYear={`${startYear}/${parseInt(startYear) + 1}`} />
    </div>
  )
}