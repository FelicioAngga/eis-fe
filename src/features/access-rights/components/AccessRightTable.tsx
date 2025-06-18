import { ColumnDef } from "@tanstack/react-table";
import { AccessRightModel } from "../../../api-hooks/access-rights/models/AccessRightModel";
import Table, { PaginationModelProps } from "../../../components/Table";
import { useMemo } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { useAccessRightQuery, useDeleteRole } from "../../../api-hooks/access-rights/api";
import { useAlert } from "../../../contexts/AlertContext";
import { useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";

interface AccessRightTableProps {
  search: string;
  paginationModel: PaginationModelProps;
  handleEdit?: (id: number) => void;
}

function AccessRightTable({ paginationModel, search, handleEdit }: AccessRightTableProps) {
  const { showAlert } = useAlert();
  const queryClient = useQueryClient();
  const { data } = useAccessRightQuery({
    pagination: {
      limit: paginationModel.pageSize,
      page: paginationModel.pageNumber,
      sortColumn: paginationModel.sortColumn,
      sortOrder: paginationModel.sortOrder,
    },
    search: search || "",
  });

  const { mutateAsync } = useDeleteRole();
  async function handleDelete(id: number) {
    const modalResult = await Swal.fire({
      title: "Konfirmasi",
      text: "Apakah anda yakin untuk menghapus?",
      icon: "warning",
      confirmButtonText: "Ya",
      showCancelButton: true,
    });
    if (!modalResult.isConfirmed) return;
    const response = await mutateAsync(id);
    if (response.status === 200) {
      showAlert({
        title: "Berhasil",
        type: "success",
        message: "Role berhasil dihapus",
      });
      queryClient.invalidateQueries({ queryKey: ["access-rights"] });
    } else {
      showAlert({
        title: "Gagal",
        type: "error",
        message: response.message || "Gagal menghapus role",
      });
    }
  }

  const columns = useMemo<ColumnDef<AccessRightModel>[]>(
    () => [
      {
        accessorKey: "no",
        header: () => "No",
        cell: (info) => info.row.index + 1 + (paginationModel.pageNumber - 1) * paginationModel.pageSize,
        size: 10,
      },
      {
        accessorKey: "name",
        header: () => "Nama Role",
      },
      {
        accessorKey: "action",
        header: () => "Action",
        cell: ({ row }) => (
          <div className="flex gap-2">
            <FiEdit 
              className="size-5 cursor-pointer"
              onClick={() => handleEdit && handleEdit(row.original.id || 0)}
            />
            {
              (row?.original?.id || 0) > 5 &&
              <FiTrash2
                className="text-danger size-5 cursor-pointer"
                onClick={() => handleDelete(row.original.id || 0)}
              />
            }
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

export default AccessRightTable