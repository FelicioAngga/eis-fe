import { useMemo } from "react";
import { useAuth } from "./useAuth";

type PermissionAccess = {
  read: boolean;
  write: boolean;
};

export const usePermissionAccess = () => {
  const { getUser } = useAuth();
  const { permissions } = getUser();

  const getPermissionAccess = useMemo(() => {
    return (permissionName: string | undefined): PermissionAccess => {
      if (!permissionName || !permissions?.length) return { read: false, write: false };

      const matchedPermissions = permissions.filter(
        perm => perm?.split(":")[0] === permissionName
      );

      let isRead = false;
      let isWrite = false;

      matchedPermissions.forEach(perm => {
        const [, accessType] = perm.split(":");
        if (accessType === "write") isWrite = true;
        if (accessType === "read") isRead = true;
      });

      return { read: isRead, write: isWrite };
    };
  }, [permissions]);

  return { getPermissionAccess };
};