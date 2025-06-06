import { FaRegFileAlt } from "react-icons/fa";
import { FaRegUser } from "react-icons/fa6";
import { MdOutlineDocumentScanner } from "react-icons/md";
import { TbCalendarClock } from "react-icons/tb";
import { Link } from "react-router-dom";

function StudentSideBar() {
  const isActive = (path: string | undefined) => path && (location.pathname === path || location.pathname.startsWith(path + "/"));

  return (
    <aside className="h-full overflow-y-auto bg-white border-r border-gray-300 px-4 py-6 space-y-4 shadow-sm print:hidden min-w-64">
      <p className="font-semibold text-sm mb-2">Personal</p>
      <Link
        to={"/student-data"}
        className={`block p-3 rounded font-medium ${
          isActive("/student-data")
            ? "bg-blue text-white"
            : "text-gray-700 hover:bg-gray-100"
        }`}
      >
        <div className="flex items-center gap-2">
          <FaRegUser />
          <span>Student Data</span>
        </div>
      </Link>
      <p className="font-semibold text-sm mb-2">Academic</p>
      <Link
        to={"/student-schedule"}
        className={`block p-3 rounded font-medium ${
          isActive("/student-schedule")
            ? "bg-blue text-white"
            : "text-gray-700 hover:bg-gray-100"
        }`}
      >
        <div className="flex items-center gap-2">
          <TbCalendarClock />
          <span>Class Schedule</span>
        </div>
      </Link>
      <p className="font-semibold text-sm mb-2">Reporting</p>
      <Link
        to={"/student-absence"}
        className={`block p-3 rounded font-medium ${
          isActive("/student-absence")
            ? "bg-blue text-white"
            : "text-gray-700 hover:bg-gray-100"
        }`}
      >
        <div className="flex items-center gap-2">
          <MdOutlineDocumentScanner />
          <span>Absence</span>
        </div>
      </Link>
      <Link
        to={"/score"}
        className={`block p-3 rounded font-medium ${
          isActive("/score")
            ? "bg-blue text-white"
            : "text-gray-700 hover:bg-gray-100"
        }`}
      >
        <div className="flex items-center gap-2">
          <FaRegFileAlt />
          <span>Score</span>
        </div>
      </Link>
    </aside>
  )
}

export default StudentSideBar;
