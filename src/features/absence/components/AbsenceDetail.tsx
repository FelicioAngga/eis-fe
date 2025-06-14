import { useNavigate, useParams } from 'react-router-dom'
import { useClassDetail } from '../../../api-hooks/class/api';
import { useEffect, useState } from 'react';
import Button from '../../../components/Button';
import { useBrowseAbsenceByAcademicIdAndTermId, useUpdateAbsence } from '../../../api-hooks/absence/api';
import { useAlert } from '../../../contexts/AlertContext';
import { useQueryClient } from '@tanstack/react-query';

type OptionValue = "Present" | "Sick" | "Permission" | "Alpha";

type RadioState = {
  [rowIndex: number]: OptionValue;
};

function AbsenceDetail() {
  const { id } = useParams();
  const { showAlert } = useAlert();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { data: classDetail } = useClassDetail(id ? parseInt(id) : 0);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0] || "");
  const [termId, setTermId] = useState<number>(0);
  const [radioValues, setRadioValues] = useState<RadioState>({});

  const { data: absenceData } = useBrowseAbsenceByAcademicIdAndTermId(
    id ? parseInt(id) : 0, 
    termId, 
    selectedDate, 
    { pagination: { limit: 99999}, search: "" }
  );

  const handleRadioChange = (rowIndex: number, value: OptionValue) => {
    setRadioValues((prev) => ({
      ...prev,
      [rowIndex]: value,
    }));
  };

  const { mutateAsync } = useUpdateAbsence();
  const handleSubmit = async () => {
    const students = Object.entries(radioValues).map(([studentId, status]) => ({
      student_id: parseInt(studentId),
      status,
    }));
    const response = await mutateAsync({
      academic_id: id ? parseInt(id) : 0,
      date: selectedDate,
      students,
      term_id: termId,
    });
    if (response.status === 200) {
      showAlert({
        title: "Berhasil",
        type: "success",
        message: "Absensi berhasil disimpan.",
      })
      queryClient.invalidateQueries({
        queryKey: ["class", id ? parseInt(id) : 0],
      });
    } else {
      showAlert({
        title: "Gagal",
        type: "error",
        message: response.message || "Terjadi kesalahan saat menyimpan absensi.",
      });
    }
  }

  useEffect(() => {
    const initialValues: RadioState = {};
    classDetail?.data.students?.forEach((student) => {
      initialValues[student?.id || 0] = "Present" as OptionValue;
    })
    absenceData?.data?.students?.forEach((absence) => {
      initialValues[absence.student_id] = absence.status as OptionValue;
    });
    setRadioValues(initialValues);
  }, [classDetail, selectedDate, absenceData, termId]);

  useEffect(() => {
    setTermId(classDetail?.data?.terms?.[0]?.id || 0);
  }, [classDetail?.data?.terms]);

  return (
    <div>
      <div className="flex justify-between">
        <div>
          <p className="font-semibold text-2xl">Absensi Kelas Siswa</p>
          <table className="mt-2">
            <tbody className="font-medium text-sm">
              <tr>
                <td className="pr-8 pb-2">Tanggal</td>
                <td className="pr-8 pb-2">:</td>
                <td className="pr-8 pb-2">
                  <input
                    type="date"
                    className="border border-gray-300 rounded-lg px-3 py-1 w-full"
                    value={selectedDate || ""}
                    onChange={(e) => setSelectedDate(e.currentTarget.value || "")}
                  />
                </td>
              </tr>
              <tr>
                <td className="pr-8 pb-2">Semester</td>
                <td className="pr-8 pb-2">:</td>
                <td className="pr-8 pb-2">
                  <div className="relative pr-3">
                    <select
                      className="w-full border border-gray-300 appearance-none rounded-md px-3 py-2 cursor-pointer"
                      onChange={(e) => setTermId(parseInt(e.currentTarget.value))}
                    >
                      {classDetail?.data?.terms?.map(term => 
                        <option value={term.id} key={term.id}>{term.name}</option>
                      )}
                    </select>
                    <div className="absolute inset-y-0 right-5 flex items-center px-2 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="pr-8 pb-3">Kelas</td>
                <td className="pr-8 pb-3">:</td>
                <td className="pr-8 pb-3">{classDetail?.data.classroom}</td>
              </tr>
              <tr>
                <td className="pr-8 pb-3">Jenjang</td>
                <td className="pr-8 pb-3">:</td>
                <td className="pr-8 pb-3">{classDetail?.data.level_name}</td>
              </tr>
              <tr>
                <td className="pr-8 pb-3">Jurusan</td>
                <td className="pr-8 pb-3">:</td>
                <td className="pr-8 pb-3">{classDetail?.data.major}</td>
              </tr>
              <tr>
                <td className="pr-8 pb-3">Wali Kelas</td>
                <td className="pr-8 pb-3">:</td>
                <td className="pr-8 pb-3">
                  {classDetail?.data.homeroom_teacher || "-"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="flex gap-5">
          <Button onClick={() => navigate("/absence")} className="w-full" variant="outline">Batal</Button>
          <Button onClick={handleSubmit} className="w-full">Simpan</Button>
        </div>
      </div>

      <div>
        <div className="mt-5 font-medium text-sm flex py-3 border border-gray-300 bg-gray-100">
          <div className="w-1/12 text-center">No</div>
          <div className="w-2/12">Nama Lengkap</div>
          <div className="w-2/12">NISN</div>
          <div className="w-2/12">NIS</div>
          <div className="w-2/12 text-center">Hadir</div>
          <div className="w-2/12 text-center">Sakit</div>
          <div className="w-2/12 text-center">Izin</div>
        </div>

        {classDetail?.data.students?.map((student, index) => (
          <div
            key={index}
            className="font-medium text-sm flex py-3 border-b border-r border-l border-gray-300"
          >
            <div className="w-1/12 text-center">{index + 1}</div>
            <div className="w-2/12">{student.full_name}</div>
            <div className="w-2/12">{student.nisn ||'-'}</div>
            <div className="w-2/12">{student.nis}</div>
            <div className="w-2/12 text-center">
              <input
                type="radio"
                name={`status-${student.id}`}
                value="Present"
                checked={radioValues[student.id || 0] === "Present"}
                onChange={() => handleRadioChange(student.id || 0, "Present")}
              />
            </div>
            <div className="w-2/12 text-center">
              <input
                type="radio"
                name={`status-${student.id}`}
                value="Sick"
                checked={radioValues[student.id || 0] === "Sick"}
                onChange={() => handleRadioChange(student.id || 0, "Sick")}
              />
            </div>
            <div className="w-2/12 text-center">
              <input
                type="radio"
                name={`status-${student.id}`}
                value="Permission"
                checked={radioValues[student.id || 0] === "Permission"}
                onChange={() => handleRadioChange(student.id || 0, "Permission")}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AbsenceDetail