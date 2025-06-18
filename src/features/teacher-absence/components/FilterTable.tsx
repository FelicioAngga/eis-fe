import { FiSearch } from "react-icons/fi";
import { useState } from "react";
import Button from "../../../components/Button";

interface Props {
  onSearch: ({name, date}: {name: string, date: string}) => void;
  buttonText?: string;
  importButtonOnClick?: () => void;
  buttonOnClick?: () => void;
  hideButton?: boolean;
}

function FilterTable({ hideButton, buttonText, onSearch, importButtonOnClick, buttonOnClick }: Props) {
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");

  return (
    <div>
      <p className="mb-3 font-semibold text-xl">Data Absensi Guru</p>
      <div className="flex gap-3 items-center justify-between">
        <div className="flex gap-2 items-center">
          <input 
            type="date" 
            className="border border-gray-400 rounded px-2 py-2 cursor-pointer" 
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              onSearch({ name: search, date: e.target.value });
            }}
          />
          <div className="relative">
            <input
              type="text"
              placeholder="Enter untuk mencari"
              className="border border-gray-400 rounded-md pl-8 py-2 w-xs"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") onSearch({ name: search, date });
              }}
            />
            <FiSearch className="absolute top-2.5 left-2 text-xl text-gray-400" />
          </div>
          <Button onClick={() => onSearch({ name: search, date })}>Cari</Button>
        </div>
        <div className="flex gap-2 items-center">
          {hideButton || <Button onClick={importButtonOnClick} className="h-full">Import Data Absensi</Button>}
          {hideButton || <Button onClick={buttonOnClick} className="h-full">{buttonText}</Button>}
        </div>
      </div>
    </div>
  )
}

export default FilterTable;
