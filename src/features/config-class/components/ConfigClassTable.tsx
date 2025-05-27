import { useQueryClient } from "@tanstack/react-query";
import Table, { PaginationModelProps } from "../../../components/Table";
import { useAlert } from "../../../contexts/AlertContext";
import { useConfigClassQuery, useDeleteConfigClass } from "../../../api-hooks/config-class/api";
import Swal from "sweetalert2";
import { ConfigClassModel } from "../../../api-hooks/config-class/models/ConfigClassModel";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";

interface ConfigClassTableProps {
  search: string;
  paginationModel: PaginationModelProps;
  handleEdit: (data: ConfigClassModel) => void;
}

function ConfigClassTable({ paginationModel, search, handleEdit }: ConfigClassTableProps) {
  const { showAlert } = useAlert();
  const queryClient = useQueryClient();
  
  const { data } = useConfigClassQuery({
    pagination: {
      limit: paginationModel.pageSize,
      page: paginationModel.pageNumber,
      sortColumn: paginationModel.sortColumn,
      sortOrder: paginationModel.sortOrder,
    },
    search: search || "",
  });

  const { mutateAsync: mutateDeleteConfigClass } = useDeleteConfigClass();

  const handleDelete = async (id: number | undefined) => {
    if (!id) return;
    const modalResult = await Swal.fire({
      title: "Konfirmasi",
      text: "Apakah anda yakin untuk menghapus?",
      icon: "warning",
      confirmButtonText: "Ya",
      showCancelButton: true,
    });
    if (!modalResult.isConfirmed) return;
    const response = await mutateDeleteConfigClass(id);
    if (response.status === 200) {
      queryClient.invalidateQueries({
        queryKey: ["classrooms"]
      });
      showAlert({
        title: "Berhasil",
        message: response.message,
        type: "success",
      });
    }
  };

  const columns = useMemo<ColumnDef<ConfigClassModel>[]>(
    () => [
      {
        accessorKey: "no",
        header: () => "No",
        cell: (info) => info.row.index + 1 + (paginationModel.pageNumber - 1) * paginationModel.pageSize,
        size: 10,
      },
      {
        accessorKey: "display_name",
        header: () => "Name",
      },
      {
        accessorKey: "level",
        header: () => "Jenjang",
        cell: ({ row }) => row.original?.level?.name || "Tidak Diketahui",
      },
      {
        accessorKey: "grade",
        header: () => "Tingkat",
      },
      {
        accessorKey: "name",
        header: () => "Kelas",
      },
      {
        accessorKey: "action",
        header: () => "Action",
        cell: ({ row }) => (
          <div className="flex gap-2">
            <FiEdit
              className="size-5 cursor-pointer"
              onClick={() => handleEdit(row.original)}
            />
            <FiTrash2
              className="text-danger size-5 cursor-pointer"
              onClick={() => handleDelete(row.original.id)}
            />
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
  );
}

export default ConfigClassTable;