import { useAuth } from "../../hooks/useAuth";
import AdminClassNote from "./components/AdminClassNote";
import TeacherClassNote from "./components/TeacherClassNote";

export default function ClassNoteDetail() {
  const { getUser } = useAuth();
  return (
    <div>
      {getUser().role_name === "Admin" ? <AdminClassNote /> : <TeacherClassNote />}
    </div>
  )
}