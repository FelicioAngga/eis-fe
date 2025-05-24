import { useState } from "react";
import SearchTableLayout from "../../components/SearchTableLayout";
import RegistrationModal from "./components/RegistrationModal";
import RegistrationTable from "./components/RegistrationTable";
import { usePaginationModel } from "../../hooks/use-pagination-model";
import { RegistrationModel } from "../../api-hooks/registration/models/RegistrationModel";


export default function Registration() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedData, setSelectedData] = useState<RegistrationModel | null>(null);
  const paginationModel = usePaginationModel({});

  const handleSubmit = (search: string) => {
    setSearch(search);
    paginationModel.onChangePageValue(1);
  }

  const handleOpenModal = (data: RegistrationModel) => {
    setIsModalOpen(true);
    setSelectedData(data);
  }

  return (
    <div>
      <RegistrationModal selectedData={selectedData} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <SearchTableLayout 
        onSearch={handleSubmit}
        hideButton
      />
      <RegistrationTable handleOpenModal={handleOpenModal} paginationModel={paginationModel} search={search} />
    </div>
  )
}