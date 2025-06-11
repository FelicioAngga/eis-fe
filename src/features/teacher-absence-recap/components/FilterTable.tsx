import { useState } from 'react'
import Button from '../../../components/Button';
import { FiSearch } from 'react-icons/fi';

interface Props {
  onSearch: ({name, startDate, endDate}: {name: string, startDate: string, endDate: string}) => void;
}

function FilterTable({ onSearch }: Props) {
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  return (
    <div>
      {/* <p className="mb-3 font-semibold text-xl">Laporan Absensi Guru</p> */}
      <div className="flex gap-3 items-center justify-between">
        <div className="flex gap-2 items-center">
          <div>
            <p className='text-sm font-medium mb-1'>Mulai Tanggal</p>
            <input
              type="date" 
              className="border border-gray-400 rounded px-2 py-2 cursor-pointer" 
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                onSearch({ name: search, startDate: e.target.value, endDate });
              }}
            />
          </div>
          <div>
            <p className='text-sm font-medium mb-1'>Sampai Tanggal</p>
            <input
              type="date" 
              className="border border-gray-400 rounded px-2 py-2 cursor-pointer" 
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                onSearch({ name: search, endDate: e.target.value, startDate });
              }}
            />
          </div>
          <div>
            <p className='text-sm font-medium mb-1'>Nama Guru</p>
            <div className="relative">
              <input
                type="text"
                placeholder="Enter untuk mencari"
                className="border border-gray-400 rounded-md pl-8 py-2 w-xs"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") onSearch({ name: search, startDate, endDate });
                }}
              />
              <FiSearch className="absolute top-2.5 left-2 text-xl text-gray-400" />
            </div>
          </div>
          <Button className='mt-6' onClick={() => onSearch({ name: search, startDate, endDate })}>Cari</Button>
        </div>
      </div>
    </div>
  )
}

export default FilterTable