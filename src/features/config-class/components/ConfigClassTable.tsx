import { useQueryClient } from "@tanstack/react-query";
import Table, { PaginationModelProps } from "../../../components/Table";
import { useAlert } from "../../../contexts/AlertContext";
import { useConfigClassQuery, useDeleteConfigClass, useUnDeleteConfigClass } from "../../../api-hooks/config-class/api";
import Swal from "sweetalert2";
import { ConfigClassModel } from "../../../api-hooks/config-class/models/ConfigClassModel";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { FiEdit } from "react-icons/fi";
import { MdArchive, MdUnarchive } from "react-icons/md";

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
  const { mutateAsync: mutateUnDelete } = useUnDeleteConfigClass();

  const handleDelete = async (id: number | undefined) => {
    if (!id) return;
    const modalResult = await Swal.fire({
      title: "Konfirmasi",
      text: "Apakah anda yakin untuk nonaktifkan?",
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
        message: "Kelas berhasil dinonaktifkan",
        type: "success",
      });
    }
  };

  const handleUnArchive = async (configClass: ConfigClassModel) => {
    const modalResult = await Swal.fire({
      title: "Konfirmasi",
      text: "Apakah anda yakin untuk aktifkan kelas ini?",
      icon: "warning",
      confirmButtonText: "Ya",
      showCancelButton: true,
    });
    if (!modalResult.isConfirmed) return;
    const response = await mutateUnDelete(configClass.id || 0);
    if (response.status === 200) {
      queryClient.invalidateQueries({
        queryKey: ["classrooms"]
      });
      showAlert({
        title: "Berhasil",
        message: "Kelas berhasil diaktifkan kembali",
        type: "success",
      });
    }
  }

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
        header: () => "Nama",
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
        accessorKey: "deleted_at",
        header: () => "Status",
        cell: ({ row }) => {
          return row.original.deleted_at ? (
            <div className="px-3 py-0.5 w-fit rounded-lg bg-danger text-center text-sm border text-white">Nonaktif</div>
          ) : (
            <div className="px-3 py-0.5 w-fit rounded-lg bg-success text-center text-sm border text-white">Aktif</div>
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
                  onClick={() => handleEdit(row.original)}
                />

                <MdArchive
                  className="text-danger size-5 cursor-pointer"
                  onClick={() => handleDelete(row.original.id)}
                />
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
  );
}

export default ConfigClassTable;