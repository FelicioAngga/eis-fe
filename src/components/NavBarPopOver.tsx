import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import defaultUser from "@/assets/images/default-user.jpeg";
import { FiLogOut } from 'react-icons/fi';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useDetailStudentByToken } from '../api-hooks/students/api';

function NavBarPopOver() {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const { getUser, logout } = useAuth();
  const isStudent = getUser()?.role_name?.toLocaleLowerCase() === "student";
  const { data: studentData } = useDetailStudentByToken(isStudent);

  return (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger asChild>
        <div className="flex gap-4 items-center cursor-pointer min-w-[150px]">
          <img src={isStudent ? studentData?.data.profile_pic || defaultUser : defaultUser} className="size-10 object-cover rounded-full" />
          <p className="font-semibold text-sm">{getUser()?.name || ""}</p>
        </div>
      </PopoverTrigger>
      <PopoverContent className="py-3 px-2 rounded bg-white">
        <div className="flex flex-col gap-2">
          <div 
            onClick={() => { logout(); setPopoverOpen(false); }}
            className="flex items-center gap-2 py-2 px-1 cursor-pointer text-danger hover:bg-danger hover:text-white transition-all duration-200 rounded"
          >
            <FiLogOut />
            <p className="text-sm font-medium">Logout</p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default NavBarPopOver;
