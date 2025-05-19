import { FiSearch } from "react-icons/fi";
import Button from "./Button";
import { useState } from "react";

interface Props {
  onSearch: (value: string) => void;
  buttonText?: string;
  buttonOnClick?: () => void;
}

function SearchTableLayout({ buttonText, onSearch, buttonOnClick }: Props) {
  const [search, setSearch] = useState("");
  return (
    <div className="flex gap-3 items-center justify-between">
      <div className="flex gap-2">
        <div className="relative">
          <input
            type="text"
            placeholder="Enter untuk mencari"
            className="border border-gray-400 rounded-md pl-8 py-2 w-xs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onSearch(search);
            }}
          />
          <FiSearch className="absolute top-2.5 left-2 text-xl text-gray-400" />
        </div>
        <Button onClick={() => onSearch(search)}>Cari</Button>
      </div>
      <Button onClick={buttonOnClick} className="h-full">{buttonText}</Button>
    </div>
  )
}

export default SearchTableLayout;
