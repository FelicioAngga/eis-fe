import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";
import { menuIconMap, sideBarCategoryMenu } from "../utils/sidebarData";

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  const toggleMenu = (title: string, category: string) => {
    setOpenMenus((prev) =>
      prev.includes(title + category) ? prev.filter((t) => t !== title + category) : [...prev, title + category]
    );
  };

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

  return (
    <aside className="h-full overflow-y-auto bg-white border-r border-gray-300 px-4 py-6 space-y-4 shadow-sm">
      <nav className="space-y-5">
        {sideBarCategoryMenu.map((categoryItem) => (
          <div key={categoryItem.category}>
            <p className="font-semibold text-sm mb-2">{categoryItem.category}</p>
            {categoryItem.children.map((menu) => {
              const Icon = menuIconMap[menu.iconName as keyof typeof menuIconMap];
              return (
                <div key={menu.title}>
                  {menu.children ? (
                    <div>
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
                      {openMenus.includes(menu.title + categoryItem.category) && (
                        <div className="pl-5 space-y-1">
                          {menu.children.map((sub) => {
                            const SubIcon = menuIconMap[sub.iconName as keyof typeof menuIconMap];
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
