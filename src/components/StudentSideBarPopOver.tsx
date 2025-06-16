import { FaRegFileAlt } from "react-icons/fa";
import { FaRegUser } from "react-icons/fa6";
import { MdOutlineDocumentScanner } from "react-icons/md";
import { TbCalendarClock } from "react-icons/tb";
import { Link } from "react-router-dom";

function StudentSideBarPopOver() {
  const isActive = (path: string | undefined) =>
    path &&
    (location.pathname === path || location.pathname.startsWith(path + "/"));

  return (
    <div className="flex flex-col space-y-2 md:hidden">
      <Link
        to={"/student-data"}
        className={`block p-2 rounded font-medium text-sm ${
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
      <Link
        to={"/student-schedule"}
        className={`block p-3 rounded font-medium text-sm ${
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
      <Link
        to={"/student-absence"}
        className={`block p-3 rounded font-medium text-sm ${
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
        className={`block p-3 rounded font-medium text-sm ${
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
    </div>
  );
}

export default StudentSideBarPopOver;
