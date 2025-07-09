import { useState } from 'react'
import Button from '../../../components/Button';
import { FiSearch } from 'react-icons/fi';
import { useAuth } from '../../../hooks/useAuth';

interface Props {
  onSearch: ({name, startDate, endDate}: {name: string, startDate: string, endDate: string}) => void;
}

function FilterTable({ onSearch }: Props) {
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const { getUser } = useAuth();

  return (
    <div>
      <p className="mb-3 text-xl font-semibold">Laporan Absensi Guru</p>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div>
            <p className='mb-1 text-sm font-medium'>Mulai Tanggal</p>
            <input
              type="date" 
              className="px-2 py-2 border border-gray-400 rounded cursor-pointer" 
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                onSearch({ name: search, startDate: e.target.value, endDate });
              }}
            />
          </div>
          <div>
            <p className='mb-1 text-sm font-medium'>Sampai Tanggal</p>
            <input
              type="date" 
              className="px-2 py-2 border border-gray-400 rounded cursor-pointer" 
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                onSearch({ name: search, endDate: e.target.value, startDate });
              }}
            />
          </div>
          {(getUser().role_name === "Teacher" || getUser().role_name === "Homeroom Teacher") ?
            <></> : 
            <>
              <div>
                <p className='mb-1 text-sm font-medium'>Nama Guru</p>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter nama untuk mencari"
                    className="py-2 pl-8 border border-gray-400 rounded-md w-xs"
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
            </>
          }
        </div>
      </div>
    </div>
  )
}

export default FilterTable