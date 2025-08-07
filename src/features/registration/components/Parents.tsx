import { RegistrationModel } from "../../../api-hooks/registration/models/RegistrationModel"
import { formatDate } from "../../../utils/formatDate";

function Parents({ selectedData }: { selectedData?: RegistrationModel | null }) {
  const dadData = selectedData?.guardians.find(g => g.relation === "father");
  const momData = selectedData?.guardians.find(g => g.relation === "mother");

  return (
    <div className="mt-5 font-medium">
      <p className="font-semibold text-gray-600">Data Ayah Siswa</p>
      <div className="pl-2 mt-1">
        <table>
          <tbody>
            <tr>
              <td className="pb-2">Nama Ayah</td>
              <td className="pb-2 pl-5">{dadData?.name || "-"}</td>
            </tr>
            <tr>
              <td className="pb-2">Alamat Ayah</td>
              <td className="pb-2 pl-5">{dadData?.address || "-"}</td>
            </tr>
            <tr>
              <td className="pb-2">Tempat Lahir</td>
              <td className="pb-2 pl-5">{dadData?.place_of_birth || "-"}</td>
            </tr>
            <tr>
              <td className="pb-2">Tanggal Lahir</td>
              <td className="pb-2 pl-5">{formatDate(dadData?.date_of_birth || "") || "-"}</td>
            </tr>
            <tr>
              <td className="pb-2">Agama</td>
              <td className="pb-2 pl-5">{dadData?.religion || "-"}</td>
            </tr>
            <tr>
              <td className="pb-2">Pendidikan Tertinggi</td>
              <td className="pb-2 pl-5">{dadData?.highest_education || "-"}</td>
            </tr>
            <tr>
              <td className="pb-2">Pekerjaan</td>
              <td className="pb-2 pl-5">{dadData?.job || "-"}</td>
            </tr>
            <tr>
              <td className="pb-2">No Telp</td>
              <td className="pb-2 pl-5">{dadData?.phone || "-"}</td>
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
              <td className="pb-2 pl-5">{momData?.name || "-"}</td>
            </tr>
            <tr>
              <td className="pb-2">Alamat Ibu</td>
              <td className="pb-2 pl-5">{momData?.address || "-"}</td>
            </tr>
            <tr>
              <td className="pb-2">Tempat Lahir</td>
              <td className="pb-2 pl-5">{momData?.place_of_birth || "-"}</td>
            </tr>
            <tr>
              <td className="pb-2">Tanggal Lahir</td>
              <td className="pb-2 pl-5">{formatDate(momData?.date_of_birth || "") || "-"}</td>
            </tr>
            <tr>
              <td className="pb-2">Agama</td>
              <td className="pb-2 pl-5">{momData?.religion || "-"}</td>
            </tr>
            <tr>
              <td className="pb-2">Pendidikan Tertinggi</td>
              <td className="pb-2 pl-5">{momData?.highest_education || "-"}</td>
            </tr>
            <tr>
              <td className="pb-2">Pekerjaan</td>
              <td className="pb-2 pl-5">{momData?.job || "-"}</td>
            </tr>
            <tr>
              <td className="pb-2">No Telp</td>
              <td className="pb-2 pl-5">{momData?.phone || "-"}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Parents