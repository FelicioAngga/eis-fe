import { FiSearch } from "react-icons/fi";
import { useState } from "react";
import Button from "../../../components/Button";
import { Select } from "antd";

interface Props {
  onSearch: (value: string, type: string) => void;
  buttonText?: string;
  buttonOnClick?: () => void;
  hideButton?: boolean;
  hideInput?: boolean;
  placeholder?: string;
}

function FilterTable({ hideButton, hideInput, buttonText, placeholder, onSearch, buttonOnClick }: Props) {
  const [search, setSearch] = useState("");
  const [selectedType, setselectedType] = useState<string>("Semua");

  return (
    <div className="flex items-end justify-between gap-3">
      {hideInput || 
        <div className="flex items-end gap-3">
          <div className="flex gap-2">
            <div className="relative">
                <input
                  type="text"
                  placeholder={placeholder ? placeholder : "Enter nama untuk mencari"}
                  className="py-2 pl-8 border border-gray-400 rounded-md w-xs"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") onSearch(search, selectedType || "");
                  }}
                />
              <FiSearch className="absolute top-2.5 left-2 text-xl text-gray-400" />
            </div>
            <Button onClick={() => onSearch(search, selectedType || "")}>Cari</Button>
          </div>
          
          <div className="relative w-full pr-3 min-w-xs">
            <Select 
              placeholder="Pilih Tipe"
              options={[
                { label: "Semua", value: "Semua" },
                { label: "Mata Pelajaran", value: "Mata Pelajaran" },
                { label: "Ekstrakurikuler", value: "Ekstrakurikuler" }
              ]}
              showSearch
              value={selectedType || null}
              onChange={(value) => {
                setselectedType(value);
                onSearch(search, value || "");
              }}
              optionFilterProp="label"
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
              }
              size='large'
              className="w-full px-3 py-3 border border-gray-300 rounded-lg appearance-none cursor-pointer"  
            />
          </div>
        </div>
      }
      {hideButton || <Button onClick={buttonOnClick} className="h-full">{buttonText}</Button>}
    </div>
  )
}

export default FilterTable;
