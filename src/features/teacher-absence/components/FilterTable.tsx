import { FiSearch } from "react-icons/fi";
import { useState } from "react";
import Button from "../../../components/Button";
import { useAuth } from "../../../hooks/useAuth";

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
  const { getUser } = useAuth();

  return (
    <div>
      <p className="mb-3 text-xl font-semibold">Data Absensi Guru</p>
      <div className="flex items-end justify-between gap-3">
        <div className="flex items-end gap-2">
          <div>
            <p className="mb-2 text-sm font-medium">Tanggal Absensi</p>
            <input 
              type="date" 
              className="px-2 py-2 border border-gray-400 rounded cursor-pointer" 
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                onSearch({ name: search, date: e.target.value });
              }}
            />
          </div>
          {(getUser().role_name === "Teacher" || getUser().role_name === "Homeroom Teacher")
            ? <></>
            : <>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter nama untuk mencari"
                  className="py-2 pl-8 border border-gray-400 rounded-md w-xs"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") onSearch({ name: search, date });
                  }}
                />
                <FiSearch className="absolute top-2.5 left-2 text-xl text-gray-400" />
              </div>
              <Button onClick={() => onSearch({ name: search, date })}>Cari</Button>
            </>
          }
        </div>
        <div className="flex items-center gap-2">
          {hideButton || <Button onClick={importButtonOnClick} className="h-full">Import Data Absensi</Button>}
          {hideButton || <Button onClick={buttonOnClick} className="h-full">{buttonText}</Button>}
        </div>
      </div>
    </div>
  )
}

export default FilterTable;
