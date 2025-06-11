
import { useState } from 'react';
import { useClassQuery } from '../../../api-hooks/class/api';
import { useGradeQuery } from '../../../api-hooks/grade/api'
import { FiSearch } from 'react-icons/fi';
import Button from '../../../components/Button';

interface Props {
  onSearch: ({ name, startDate, endDate, level_id, }: { 
    name: string,
    startDate: string, 
    endDate: string,
    level_id: string,
    academic_id: string
  }) => void;
}


function FilterTable({ onSearch }: Props) {
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [levelId, setLevelId] = useState("");
  const [academicId, setAcademicId] = useState("");

  const { data: gradeData } = useGradeQuery({ pagination: { limit: 999 }, search: "" });
  const { data: academicData } = useClassQuery({ pagination: { limit: 9999 }, search: "" })

  return (
    <div>
      <p className="mb-3 font-semibold text-xl">Laporan Absensi Murid</p>
      <div className="flex gap-2 items-center">
        <div className="relative pr-4 text-sm min-w-[160px]">
          <p className='mb-1 font-medium'>Jenjang</p>
          <select 
            value={levelId}
            onChange={(e) => {
              setLevelId(e.target.value);
              onSearch({ name: search, startDate, endDate, level_id: e.target.value, academic_id: academicId });
            }} 
            className="w-full border border-gray-300 appearance-none rounded-md px-3 py-2.5 cursor-pointer"
          >
            <option value="">Pilih Jenjang</option>
            {gradeData?.data.map(grade => (
              <option value={grade.id} key={grade.id}>{grade.name}</option>
            ))}
          </select>
          <div className="absolute top-[38px] right-5 flex items-center px-2 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>

        <div className="relative pr-4 text-sm min-w-[170px]">
          <p className='mb-1 font-medium'>Akademik</p>
          <select 
            value={academicId}
            onChange={(e) => {
              setAcademicId(e.target.value);
              onSearch({ name: search, startDate, endDate, level_id: levelId, academic_id: e.target.value });
            }} 
            className="w-full border border-gray-300 appearance-none rounded-md px-3 py-2.5 cursor-pointer"
          >
            <option value="">Pilih Akademik</option>
            {academicData?.data.map(academic => (
              <option value={academic.id} key={academic.id}>{academic.display_name}</option>
            ))}
          </select>
          <div className="absolute top-[38px] right-5 flex items-center px-2 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>

        <div>
          <p className='text-sm font-medium mb-1'>Mulai Tanggal</p>
          <input
            type="date" 
            className="border border-gray-300 rounded px-2 py-2 cursor-pointer" 
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              onSearch({ name: search, startDate: e.target.value, endDate, level_id: levelId, academic_id: academicId});
            }}
          />
        </div>
        
        <div>
          <p className='text-sm font-medium mb-1'>Sampai Tanggal</p>
          <input
            type="date" 
            className="border border-gray-300 rounded px-2 py-2 cursor-pointer" 
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value);
              onSearch({ name: search, endDate: e.target.value, startDate, level_id: levelId, academic_id: academicId});
            }}
          />
        </div>

        <div>
          <p className='text-sm font-medium mb-1'>Nama Akademik</p>
          <div className="relative text-sm">
            <input
              type="text"
              placeholder="Enter untuk mencari"
              className="border border-gray-300 rounded-md pl-8 py-2"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") onSearch({ name: search, startDate, endDate, level_id: levelId, academic_id: academicId});
              }}
            />
            <FiSearch className="absolute top-2.5 left-2 text-xl text-gray-400" />
          </div>
        </div>
        <Button className='mt-6' onClick={() => onSearch({ name: search, startDate, endDate, academic_id: academicId, level_id: levelId })}>Cari</Button>
      </div>
    </div>
  )
}

export default FilterTable