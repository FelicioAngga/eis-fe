import { useState } from "react";
import { usePaginationModel } from "../../hooks/use-pagination-model";
import { UserModel } from "../../api-hooks/users/models/UserModel";
import UserTable from "./components/UserTable";
import SearchTableLayout from "../../components/SearchTableLayout";
import UserModal from "./components/UserModal";

export default function() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const paginationModel = usePaginationModel({});
  const [editData, setEditData] = useState<UserModel | null>(null);

  const handleSubmit = (search: string) => {
    setSearch(search);
    paginationModel.onChangePageValue(1);
  }

  function handleEditUser(data: any) {
    setIsModalOpen(true);
    setEditData(data);
  }

  return (
    <div className="flex flex-col gap-5">
      <UserModal setEditData={setEditData} editData={editData} isOpen={isModalOpen} onClose={() => { setEditData(null); setIsModalOpen(false)}} />
      <SearchTableLayout 
        onSearch={handleSubmit}
        buttonText="Tambah User"
        buttonOnClick={() => setIsModalOpen(true)}
        hideButton
      />
      <UserTable handleEditUser={handleEditUser} paginationModel={paginationModel} search={search} />
    </div>
  )
}