import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";
import { menuIconMap, sideBarCategoryMenu } from "../utils/sidebarData";
import { useAuth } from "../hooks/useAuth";
import StudentSideBar from "./StudentSideBar";

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState<string[]>([]);
  const { getUser } = useAuth();

  const toggleMenu = (title: string, category: string) => {
    setOpenMenus((prev) =>
      prev.includes(title + category) ? prev.filter((t) => t !== title + category) : [...prev, title + category]
    );
  };

  const isUserAuthorizedByName = (permissionName: string | undefined): boolean => {
    const { permissions } = getUser();
    if ((permissions?.length || 0) <= 0) return false;
    return (permissions?.filter(permission => permission?.split(":")[0] === permissionName)?.length || 0) > 0;
  }

  const isActive = (path: string | undefined) => path && (location.pathname === path || location.pathname.startsWith(path + "/"));

  useEffect(() => {
    const match = sideBarCategoryMenu.find((category) =>
      category.children.some((menu) =>
        menu.children?.some((sub) => isActive(sub.path))
      )
    );
    if (!match) return;
    const activeMenu = match.children.find((menu) => menu.children?.some((sub) => isActive(sub.path)));
    if (activeMenu) setOpenMenus((prev) => [...prev, `${activeMenu.title}${match.category}`]);
  }, []);

  if (getUser()?.role_name?.toLocaleLowerCase() === "student") return <StudentSideBar />;
  return (
    <aside className="h-full overflow-y-auto bg-white border-r border-gray-300 px-4 py-6 space-y-4 shadow-sm print:hidden">
      <nav className="space-y-5">
        {sideBarCategoryMenu.map((categoryItem) => (
          <div key={categoryItem.category}>
            {categoryItem.children.filter(menu => isUserAuthorizedByName(menu.permissionName)).length === 0 && categoryItem.children.every(menu => !menu.children || menu.children.every(sub => !isUserAuthorizedByName(sub.permissionName)))
            ? null : <p className="font-semibold text-sm mb-2">{categoryItem.category}</p>}
            {categoryItem.children.map((menu) => {
              const Icon = menuIconMap[menu.iconName as keyof typeof menuIconMap];
              return (
                <div key={menu.title}>
                  {menu.children ? (
                    <div>
                      {menu.children.filter(sub => isUserAuthorizedByName(sub.permissionName)).length === 0 ? null : 
                        <button
                          onClick={() => toggleMenu(menu.title, categoryItem.category)}
                          className="flex gap-1 items-center justify-between w-full px-2 py-3 rounded cursor-pointer hover:bg-gray-100 font-medium text-gray-700"
                        >
                          <div className="flex items-center gap-1">
                            {Icon && <Icon className="text-2xl" />}
                            <span>{menu.title}</span>
                          </div>
                          {openMenus.includes(menu.title + categoryItem.category) ? (
                            <ChevronDown className="size-4" />
                          ) : (
                            <ChevronRight className="size-4" />
                          )}
                        </button>
                      }
                      {openMenus.includes(menu.title + categoryItem.category) && (
                        <div className="pl-5 space-y-1">
                          {menu.children.map((sub) => {
                            const SubIcon = menuIconMap[sub.iconName as keyof typeof menuIconMap];
                            if (!isUserAuthorizedByName(sub.permissionName)) return null;
                            return (
                              <Link
                                key={sub.title}
                                to={sub.path || "#"}
                                className={`block p-3 rounded font-medium ${
                                  isActive(sub.path)
                                    ? "bg-blue text-white"
                                    : "text-gray-600 hover:bg-gray-100"
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  {SubIcon && <SubIcon className="text-xl" />}
                                  <p>{sub.title}</p>
                                </div>
                              </Link>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  ) : (
                    isUserAuthorizedByName(menu.permissionName) ?
                    <Link
                      to={menu.path || "#"}
                      className={`block p-3 rounded font-medium ${
                        isActive(menu.path)
                          ? "bg-blue text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        {Icon && <Icon className="text-xl" />}
                        <span>{menu.title}</span>
                      </div>
                    </Link>
                    : null
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
};
