import { RegistrationModel } from "../../../api-hooks/registration/models/RegistrationModel"
import { formatDate } from "../../../utils/formatDate";

function Parents({ selectedData }: { selectedData?: RegistrationModel | null }) {
  const dadData = selectedData?.guardians.find(g => g.relation === "father");
  const momData = selectedData?.guardians.find(g => g.relation === "mother");

  return (
    <div className="font-medium mt-5">
      <p className="font-semibold text-gray-600">Data Ayah Siswa</p>
      <div className="pl-2 mt-1">
        <table>
          <tbody>
            <tr>
              <td className="pb-2">Nama Ayah</td>
              <td className="pl-5 pb-2">{dadData?.address || "-"}</td>
            </tr>
            <tr>
              <td className="pb-2">Tempat Lahir</td>
              <td className="pl-5 pb-2">{dadData?.place_of_birth || "-"}</td>
            </tr>
            <tr>
              <td className="pb-2">Tanggal Lahir</td>
              <td className="pl-5 pb-2">{formatDate(dadData?.date_of_birth || "") || "-"}</td>
            </tr>
            <tr>
              <td className="pb-2">Agama</td>
              <td className="pl-5 pb-2">{dadData?.religion || "-"}</td>
            </tr>
            <tr>
              <td className="pb-2">Pendidikan Tertinggi</td>
              <td className="pl-5 pb-2">{dadData?.highest_education || "-"}</td>
            </tr>
            <tr>
              <td className="pb-2">Pekerjaan</td>
              <td className="pl-5 pb-2">{dadData?.job || "-"}</td>
            </tr>
            <tr>
              <td className="pb-2">No Telp</td>
              <td className="pl-5 pb-2">{dadData?.phone || "-"}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mt-4 font-semibold text-gray-600">Data Ibu Siswa</p>
      <div className="pl-2 mt-1">
        <table>
          <tbody>
            <tr>
              <td className="pb-2">Nama Ibu</td>
              <td className="pl-5 pb-2">{momData?.address || "-"}</td>
            </tr>
            <tr>
              <td className="pb-2">Tempat Lahir</td>
              <td className="pl-5 pb-2">{momData?.place_of_birth || "-"}</td>
            </tr>
            <tr>
              <td className="pb-2">Tanggal Lahir</td>
              <td className="pl-5 pb-2">{formatDate(momData?.date_of_birth || "") || "-"}</td>
            </tr>
            <tr>
              <td className="pb-2">Agama</td>
              <td className="pl-5 pb-2">{momData?.religion || "-"}</td>
            </tr>
            <tr>
              <td className="pb-2">Pendidikan Tertinggi</td>
              <td className="pl-5 pb-2">{momData?.highest_education || "-"}</td>
            </tr>
            <tr>
              <td className="pb-2">Pekerjaan</td>
              <td className="pl-5 pb-2">{momData?.job || "-"}</td>
            </tr>
            <tr>
              <td className="pb-2">No Telp</td>
              <td className="pl-5 pb-2">{momData?.phone || "-"}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Parents