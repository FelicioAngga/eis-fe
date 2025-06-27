import { ColumnDef } from "@tanstack/react-table";
import { useCurriculumQuery, useDeleteCurriculum, useUnDeleteCurriculum } from "../../../api-hooks/curriculum/api";
import { CurriculumModel } from "../../../api-hooks/curriculum/models/CurriculumModel";
import Table, { PaginationModelProps } from "../../../components/Table";
import { useMemo } from "react";
import { FiEdit } from "react-icons/fi";
import Swal from "sweetalert2";
import { useAlert } from "../../../contexts/AlertContext";
import { useQueryClient } from "@tanstack/react-query";
import { MdArchive, MdUnarchive } from "react-icons/md";
import { usePermissionAccess } from "../../../hooks/useAccessRight";

interface CurriculumTableProps {
  search: string;
  paginationModel: PaginationModelProps;
  handleEditCurriculum: (id: number) => void;
}

function CurriculumTable({ paginationModel, search, handleEditCurriculum }: CurriculumTableProps) {
  const { showAlert } = useAlert();
  const queryClient = useQueryClient();
  const { getPermissionAccess } = usePermissionAccess();
  const { data } = useCurriculumQuery({
    pagination: {
      limit: paginationModel.pageSize,
      page: paginationModel.pageNumber,
      sortColumn: paginationModel.sortColumn,
      sortOrder: paginationModel.sortOrder,
    },
    search: search || "",
  });

  const { mutateAsync: mutateDelete } = useDeleteCurriculum();
  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Konfirmasi",
      text: "Apakah anda yakin untuk menonaktifkan kurikulum ini?",
      icon: "warning",
      confirmButtonText: "Ya",
      showCancelButton: true,
    });
    if (!result.isConfirmed) return;
    const response = await mutateDelete(id);
    if (response.status === 200) {
      showAlert({
        title: "Berhasil",
        message: "Kurikulum berhasil dinonaktifkan",
        type: "success",
      });
      queryClient.invalidateQueries({queryKey: ["curriculums"]});
    } else {
      showAlert({
        title: "Gagal",
        message: response.error || "Gagal menghapus kurikulum",
        type: "error",
      });
    }
  }

  const { mutateAsync: mutateUndelete } = useUnDeleteCurriculum();
  const handleUnArchive = async (curriculum: CurriculumModel) => {
    const result = await Swal.fire({
      title: "Konfirmasi",
      text: "Apakah anda yakin untuk mengaktifkan kembali kurikulum ini?",
      icon: "warning",
      confirmButtonText: "Ya",
      showCancelButton: true,
    });
    if (!result.isConfirmed) return;
    const response = await mutateUndelete(curriculum.id);
    if (response.status === 200) {
      showAlert({
        title: "Berhasil",
        message: "Kurikulum berhasil diaktifkan kembali",
        type: "success",
      });
      queryClient.invalidateQueries({queryKey: ["curriculums"]});
    } else {
      showAlert({
        title: "Gagal",
        message: response.error || "Gagal mengaktifkan kurikulum",
        type: "error",
      });
    }
  }

  let columns = useMemo<ColumnDef<CurriculumModel>[]>(
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
        enableSorting: true,
      },
      {
        accessorKey: "name",
        header: () => "Kurikulum",
        enableSorting: true,
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
                  onClick={() => handleEditCurriculum(row.original.id)}
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

  if (!getPermissionAccess("curriculum").write) columns.splice(4, 1);
  return (
    <Table
      columns={columns}
      totalRecords={data?.total || 0}
      data={data?.data || []}
      paginationModel={paginationModel}
    />
  )
}

export default CurriculumTable;
