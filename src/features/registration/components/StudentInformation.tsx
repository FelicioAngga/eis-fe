import { RegistrationModel } from "../../../api-hooks/registration/models/RegistrationModel";

function StudentInformation({ selectedData }: { selectedData?: RegistrationModel | null }) {
  return (
    <div className="font-medium mt-5">
      <p className="font-semibold text-gray-600">Data Pindahan Sekolah</p>
      <div className="pl-2 mt-1">
        <table>
          <tbody>
            <tr>
              <td className="pb-2">Pindahan dari sekolah</td>
              <td className="pl-5 pb-2">{selectedData?.school_origin || "-"}</td>
            </tr>
            <tr>
              <td className="pb-2">Jenjang Pendidikan</td>
              <td className="pl-5 pb-2">{selectedData?.level_id || "-"}</td>
            </tr>
            <tr>
              <td className="pb-2">Jurusan</td>
              <td className="pl-5 pb-2">{selectedData?.registration_major || "-"}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="font-semibold text-gray-600 mt-5">Data Siswa</p>
      <div className="pl-2 mt-1">
        <table>
          <tbody>
            <tr>
              <td className="pb-2">Tempat Lahir</td>
              <td className="pl-5 pb-2">{selectedData?.place_of_birth || "-"}</td>
            </tr>
            <tr>
              <td className="pb-2">Tanggal Lahir</td>
              <td className="pl-5 pb-2">{selectedData?.date_of_birth || "-"}</td>
            </tr>
            <tr>
              <td className="pb-2">Agama</td>
              <td className="pl-5 pb-2">{selectedData?.religion || "-"}</td>
            </tr>
            <tr>
              <td className="pb-2">Anak ke-</td>
              <td className="pl-5 pb-2">{selectedData?.child_sequence || "-"}</td>
            </tr>
            <tr>
              <td className="pb-2">Jumlah Saudara</td>
              <td className="pl-5 pb-2">{selectedData?.number_of_siblings || "-"}</td>
            </tr>
            <tr>
              <td className="pb-2">Status</td>
              <td className="pl-5 pb-2">{selectedData?.state || "-"}</td>
            </tr>
            <tr>
              <td className="pb-2">Tinggal Bersama</td>
              <td className="pl-5 pb-2">{selectedData?.living_with || "-"}</td>
            </tr>
            <tr>
              <td className="pb-2">Alamat</td>
              <td className="pl-5 pb-2">{selectedData?.address || "-"}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default StudentInformation;
