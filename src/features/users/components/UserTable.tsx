import { MdArchive, MdUnarchive } from "react-icons/md";
import { UserModel } from "../../../api-hooks/users/models/UserModel";
import Table, { PaginationModelProps } from "../../../components/Table";
import { FiEdit } from "react-icons/fi";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { useDeleteUser, useUnArchiveUser, useUserQuery } from "../../../api-hooks/users/api";
import { useQueryClient } from "@tanstack/react-query";
import { useAlert } from "../../../contexts/AlertContext";

interface UserTableProps {
  search: string;
  paginationModel: PaginationModelProps;
  handleEditUser: (data: UserModel | null) => void;
}

function UserTable({ handleEditUser, paginationModel, search }: UserTableProps) {
  const { showAlert } = useAlert();
  const queryClient = useQueryClient();
  const { data } = useUserQuery({
    pagination: {
      limit: paginationModel.pageSize,
      page: paginationModel.pageNumber,
      sortColumn: paginationModel.sortColumn,
      sortOrder: paginationModel.sortOrder,
    },
    search: search || "",
  });

  const { mutateAsync: deleteMutate } = useDeleteUser();
  const { mutateAsync: unArchiveMutate } = useUnArchiveUser();

  const handleDelete = async (id: number) => {
    const response = await deleteMutate(id);
    if (response.status === 200) {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
      showAlert({
        title: "Berhasil",
        message: response.message,
        type: "success",
      });
    }
  }

  const handleUnArchive = async (data: UserModel) => {
    const response = await unArchiveMutate(data.id || 0);
    if (response.status === 200) {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
      showAlert({
        title: "Berhasil",
        message: response.message,
        type: "success",
      });
    }
  }

  const columns = useMemo<ColumnDef<UserModel>[]>(
    () => [
      {
        accessorKey: "no",
        header: () => "No",
        cell: (info) =>
          info.row.index +
          1 +
          (paginationModel.pageNumber - 1) * paginationModel.pageSize,
        size: 10,
      },
      {
        accessorKey: "email",
        header: () => "Email",
      },
      {
        accessorKey: "name",
        header: () => "Nama Lengkap",
      },
      {
        accessorKey: "role",
        header: () => "Role",
        cell: ({ row }) => <p>{row.original.role?.name || "-"}</p>
      },
      {
        accessorKey: "deleted_at",
        header: () => "Status",
        cell: ({ row }) => {
          return row.original.deleted_at ? (
            <div className="w-fit px-2 py-1 rounded-lg bg-danger text-center text-xs border text-white">Nonaktif</div>
          ) : (
            <div className="w-fit px-2 py-1 rounded-lg bg-success text-center text-xs border text-white">Aktif</div>
          );
        },
      },
      {
        accessorKey: "action",
        header: () => "Action",
        cell: ({ row }) => (
          <div className="flex gap-2">
            {row.original.deleted_at ? (
              <MdUnarchive
                className="text-blue size-5 cursor-pointer"
                onClick={() => handleUnArchive(row.original)}
              />
            ) : (
              <>
                <FiEdit
                  className="size-5 cursor-pointer"
                  onClick={() => handleEditUser(row.original)}
                />
                {row.original.role?.name !== "Admin" && 
                  <MdArchive
                    className="text-danger size-5 cursor-pointer"
                    onClick={() => handleDelete(row.original.id || 0)}
                  />
                }
              </>
            )}
          </div>
        ),
      },
    ],
    [paginationModel]
  );

  return (
    <Table
      columns={columns}
      totalRecords={data?.total || 0}
      data={data?.data || []}
      paginationModel={paginationModel}
    />
  )
}

export default UserTable;
