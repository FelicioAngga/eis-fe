import { FaRegFileAlt } from "react-icons/fa";
import { FaRegUser } from "react-icons/fa6";
import { MdOutlineDocumentScanner } from "react-icons/md";
import { TbCalendarClock } from "react-icons/tb";
import { Link } from "react-router-dom";
import StudentSideBarPopOver from "./StudentSideBarPopOver";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useEffect, useState } from "react";
import { FiMenu } from "react-icons/fi";

function StudentSideBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMenu, setCurrentMenu] = useState<string | null>("Student Data");
  const isActive = (path: string | undefined) => path && (location.pathname === path || location.pathname.startsWith(path + "/"));

  useEffect(() => {
    if (!setCurrentMenu) return;
    const isStudentData = location.pathname.includes("student-data");
    const isStudentSchedule = location.pathname.includes("student-schedule");
    const isStudentAbsence = location.pathname.includes("student-absence");
    const isScore = location.pathname.includes("score");
    setCurrentMenu(isScore ? "Score" : isStudentAbsence ? "Absence" : isStudentSchedule ? "Class Schedule" : isStudentData ? "Student Data" : null);
    setIsOpen(false);
  }, [location.pathname])

  return (
    <div>
      <div className="p-3 relative md:hidden">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger className="w-full text-left">
            <div className="flex justify-between items-center rounded-lg px-3 py-2.5 bg-blue text-white">
              <p className="font-medium text-sm">{currentMenu}</p>
              <FiMenu className="size-5" />
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-full">
            <StudentSideBarPopOver />
          </PopoverContent>
        </Popover>
      </div>
      <aside className="hidden md:block h-full overflow-y-auto bg-white border-r border-gray-300 px-4 py-6 space-y-4 shadow-sm print:hidden min-w-64">
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
    </div>
  )
}

export default StudentSideBar;
