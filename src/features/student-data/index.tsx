import { useState } from "react";
import { usePaginationModel } from "../../hooks/use-pagination-model";
import SearchTableLayout from "../../components/SearchTableLayout";
import { useNavigate } from "react-router-dom";
import StudentTable from "./components/StudentTable";
import { useAuth } from "../../hooks/useAuth";
import StudentViewData from "../student-view/student-data";
import { usePermissionAccess } from "../../hooks/useAccessRight";

export default function StudentData() {
  const { getUser } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const paginationModel = usePaginationModel({});
  const { getPermissionAccess } = usePermissionAccess();

  function handleSubmit(search: string) {
    setSearch(search);
    paginationModel.onChangePageValue(1);
  }

  if (getUser().role_name.toLowerCase() === "student") return <StudentViewData />
  return (
    <div className="flex flex-col gap-5">
      <SearchTableLayout 
        onSearch={handleSubmit}
        buttonText="Tambah Siswa"
        buttonOnClick={() => navigate("/student-data/add")}
        hideButton={!getPermissionAccess("student").write}
      />
      <StudentTable search={search} paginationModel={paginationModel} />
    </div>
  );
}