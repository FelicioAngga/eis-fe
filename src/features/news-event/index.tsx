import { useNavigate } from "react-router-dom";
import SearchTableLayout from "../../components/SearchTableLayout";
import NewsList from "./components/NewsList";
import { usePaginationModel } from "../../hooks/use-pagination-model";
import { useState } from "react";
import { usePermissionAccess } from "../../hooks/useAccessRight";

export default function() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const paginationModel = usePaginationModel({});
  const { getPermissionAccess } = usePermissionAccess();

  const handleSubmit = (search: string) => {
    setSearch(search);
    paginationModel.onChangePageValue(1);
  }

  return (
    <>
      <SearchTableLayout 
        onSearch={handleSubmit}
        buttonOnClick={() => navigate("/news-event/create")}
        buttonText="Tambah Berita & Acara"
        hideButton={!getPermissionAccess("news").write}
      />
      <NewsList paginationModel={paginationModel} search={search} />
    </>
  )
}