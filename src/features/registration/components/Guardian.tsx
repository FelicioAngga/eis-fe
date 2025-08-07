import { RegistrationModel } from "../../../api-hooks/registration/models/RegistrationModel";
import { formatDate } from "../../../utils/formatDate";

function Guardian({ selectedData }: { selectedData?: RegistrationModel | null }) {
  const guardianData = selectedData?.guardians.find(g => g.relation === "guardian");

  return (
    <div className="mt-5 font-medium">
      <p className="font-semibold text-gray-600">Data Wali</p>
      <div className="pl-2 mt-1">
        <table>
          <tbody>
            <tr>
              <td className="pb-2">Nama Wali</td>
              <td className="pb-2 pl-5">{guardianData?.name || "-"}</td>
            </tr>
            <tr>
              <td className="pb-2">Alamat Wali</td>
              <td className="pb-2 pl-5">{guardianData?.address || "-"}</td>
            </tr>
            <tr>
              <td className="pb-2">Tempat Lahir</td>
              <td className="pb-2 pl-5">{guardianData?.place_of_birth || "-"}</td>
            </tr>
            <tr>
              <td className="pb-2">Tanggal Lahir</td>
              <td className="pb-2 pl-5">{formatDate(guardianData?.date_of_birth || "") || "-"}</td>
            </tr>
            <tr>
              <td className="pb-2">Agama</td>
              <td className="pb-2 pl-5">{guardianData?.religion || "-"}</td>
            </tr>
            <tr>
              <td className="pb-2">Pendidikan Tertinggi</td>
              <td className="pb-2 pl-5">{guardianData?.highest_education || "-"}</td>
            </tr>
            <tr>
              <td className="pb-2">Pekerjaan</td>
              <td className="pb-2 pl-5">{guardianData?.job || "-"}</td>
            </tr>
            <tr>
              <td className="pb-2">No Telp</td>
              <td className="pb-2 pl-5">{guardianData?.phone || "-"}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Guardian
