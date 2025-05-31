import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import defaultUser from "@/assets/images/default-user.jpeg";
import { BiUser } from 'react-icons/bi';
import { FiLogOut } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

function NavBarPopOver() {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const navigate = useNavigate();
  const { getUser, logout } = useAuth();

  return (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger asChild>
        <div className="flex gap-4 items-center cursor-pointer min-w-[150px]">
          <img src={defaultUser} className="size-10 object-cover rounded-full" />
          <p className="font-semibold text-sm">{getUser()?.name || ""}</p>
        </div>
      </PopoverTrigger>
      <PopoverContent className="py-3 px-2 rounded bg-white">
        <div className="flex flex-col gap-2">
          <div onClick={() => { navigate("/profile"); setPopoverOpen(false); }} 
            className="flex items-center gap-2 py-2 px-1 cursor-pointer hover:bg-primary hover:text-white transition-all duration-200 rounded"
          >
            <BiUser />
            <p className="text-sm font-medium">Edit Profile</p>
          </div>
          <div className="bg-primary-200 h-[1px]"></div>
          <div 
            onClick={() => { logout(); setPopoverOpen(false); }}
            className="flex items-center gap-2 py-2 px-1 cursor-pointer text-danger hover:bg-danger-400 hover:text-white transition-all duration-200 rounded"
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
