import { useState } from "react";
import { usePaginationModel } from "../../hooks/use-pagination-model";
import ConfigClassScheduleTable from "./components/ConfigClassScheduleTable";
import { FiSearch } from "react-icons/fi";
import Button from "../../components/Button";
import { YearPicker } from "../../components/YearPicker";

export default function ConfigClassSchedule() {
  const [search, setSearch] = useState("");
  const paginationModel = usePaginationModel({});
  const [startYear, setStartYear] = useState<string>(new Date().getFullYear().toString());

  function handleSubmit(search: string) {
    setSearch(search);
    paginationModel.onChangePageValue(1);
  }

  return (
    <div className="flex flex-col gap-5">
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
      <ConfigClassScheduleTable search={search} paginationModel={paginationModel} academicYear={`${startYear}/${parseInt(startYear) + 1}`} />
    </div>
  );
}