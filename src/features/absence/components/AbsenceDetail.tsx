import { useNavigate, useParams } from 'react-router-dom'
import { useClassDetail } from '../../../api-hooks/class/api';
import { useState } from 'react';
import Button from '../../../components/Button';

type OptionValue = "hadir" | "sakit" | "izin";

type RadioState = {
  [rowIndex: number]: OptionValue;
};

function AbsenceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: classDetail } = useClassDetail(id ? parseInt(id) : 0);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0] || "");
  const [radioValues, setRadioValues] = useState<RadioState>(() =>
    Object.fromEntries(
      Array.from({ length: 5 }).map((_, index) => [index, "hadir"])
    ) as RadioState
  );

  const handleRadioChange = (rowIndex: number, value: OptionValue) => {
    setRadioValues((prev) => ({
      ...prev,
      [rowIndex]: value,
    }));
  };

  const handleSubmit = () => {
    console.log(radioValues);
  }

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

        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="font-medium text-sm flex py-3 border-b border-r border-l border-gray-300"
          >
            <div className="w-1/12 text-center">{index + 1}</div>
            <div className="w-2/12">Nama Lengkap</div>
            <div className="w-2/12">NISN</div>
            <div className="w-2/12">NIS</div>
            <div className="w-2/12 text-center">
              <input
                type="radio"
                name={`status-${index}`}
                value="hadir"
                checked={radioValues[index] === "hadir"}
                onChange={() => handleRadioChange(index, "hadir")}
              />
            </div>
            <div className="w-2/12 text-center">
              <input
                type="radio"
                name={`status-${index}`}
                value="sakit"
                checked={radioValues[index] === "sakit"}
                onChange={() => handleRadioChange(index, "sakit")}
              />
            </div>
            <div className="w-2/12 text-center">
              <input
                type="radio"
                name={`status-${index}`}
                value="izin"
                checked={radioValues[index] === "izin"}
                onChange={() => handleRadioChange(index, "izin")}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AbsenceDetail