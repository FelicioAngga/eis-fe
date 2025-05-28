import { useParams } from "react-router-dom";
import { useClassDetail } from "../../api-hooks/class/api";

export default function () {
  const { id } = useParams();
  const { data } = useClassDetail(id ? parseInt(id) : 0);
  
  return (
    <div>

    </div>
  );
}