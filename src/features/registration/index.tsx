import { useState } from "react";
import SearchTableLayout from "../../components/SearchTableLayout";


export default function() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = (search: string) => {

  }

  return (
    <div>
      <SearchTableLayout 
        onSearch={handleSubmit}
        hideButton
      />
    </div>
  )
}