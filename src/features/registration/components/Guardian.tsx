import { RegistrationModel } from "../../../api-hooks/registration/models/RegistrationModel";
import { formatDate } from "../../../utils/formatDate";

function Guardian({ selectedData }: { selectedData?: RegistrationModel | null }) {
  const guardianData = selectedData?.guardians.find(g => g.relation === "guardian");

  return (
    <div className="font-medium mt-5">
      <p className="font-semibold text-gray-600">Data Wali</p>
      <div className="pl-2 mt-1">
        <table>
          <tbody>
            <tr>
              <td className="pb-2">Nama Wali</td>
              <td className="pl-5 pb-2">{guardianData?.address || "-"}</td>
            </tr>
            <tr>
              <td className="pb-2">Tempat Lahir</td>
              <td className="pl-5 pb-2">{guardianData?.place_of_birth || "-"}</td>
            </tr>
            <tr>
              <td className="pb-2">Tanggal Lahir</td>
              <td className="pl-5 pb-2">{formatDate(guardianData?.date_of_birth || "") || "-"}</td>
            </tr>
            <tr>
              <td className="pb-2">Agama</td>
              <td className="pl-5 pb-2">{guardianData?.religion || "-"}</td>
            </tr>
            <tr>
              <td className="pb-2">Pendidikan Tertinggi</td>
              <td className="pl-5 pb-2">{guardianData?.highest_education || "-"}</td>
            </tr>
            <tr>
              <td className="pb-2">Pekerjaan</td>
              <td className="pl-5 pb-2">{guardianData?.job || "-"}</td>
            </tr>
            <tr>
              <td className="pb-2">No Telp</td>
              <td className="pl-5 pb-2">{guardianData?.phone || "-"}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Guardian
