import Button from '../../../components/Button';
import { MdClose } from 'react-icons/md';
import { CustomTimeInput } from '../../../components/input/CustomInputTime';
import { useSubjectsQuery } from '../../../api-hooks/subjects/api';
import { useTeacherQuery } from '../../../api-hooks/teacher/api';

function ClassScheduleForm() {
  const { data: subjectData } = useSubjectsQuery({ pagination: { limit: 9999, page: 1 }, search: '' });
  const { data: teacherData } = useTeacherQuery({ pagination: { limit: 9999, page: 1 }, search: '' });

  return (
    <div className="mt-8">
      <div className="flex items-center border-b-2 border-b-gray-300 pb-2 space-x-2">
        <div className="w-1/12 font-semibold text-xs text-gray-600">Aksi</div>
        <div className="w-2/12 font-semibold text-xs text-gray-600">
          Mulai
        </div>
        <div className="w-2/12 font-semibold text-xs text-gray-600">
          Selesai
        </div>
        <div className="w-4/12 font-semibold text-xs text-gray-600">
          Mata Pelajaran
        </div>
        <div className="w-4/12 font-semibold text-xs text-gray-600">
          Pengajar
        </div>
      </div>

      <div className="flex items-center py-3 space-x-2 text-sm">
        <div className="w-1/12 text-danger text-xl">
          <button className="cursor-pointer"><MdClose /></button>
        </div>
        <div className="w-2/12 pr-3">
          <CustomTimeInput onChange={() => {}} value='' />
        </div>
        <div className="w-2/12 pr-3">
          <CustomTimeInput onChange={() => {}} value='' />
        </div>
        <div className="w-4/12 relative pr-3">
          <select className="w-full border border-gray-300 appearance-none rounded-md px-3 py-2.5 cursor-pointer">
            {subjectData?.data.map(subject => (
              <option value={subject.id} key={subject.id}>{subject.name}</option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-5 flex items-center px-2 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>
        <div className="w-4/12 relative pr-3">
          <select className="w-full border border-gray-300 appearance-none rounded-md px-3 py-2.5 cursor-pointer">
            {teacherData?.data.map(teacher => (
              <option value={teacher.id} key={teacher.id}>{teacher.name}</option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-5 flex items-center px-2 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>
      </div>

      <Button className="mt-20" variant="outline">Tambah</Button>
    </div>
  )
}

export default ClassScheduleForm;