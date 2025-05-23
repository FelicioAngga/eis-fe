import Table, { PaginationModelProps } from "../../../components/Table";
import { TeacherModel } from "../../../api-hooks/teacher/models/TeacherModel";
import {
  useDeleteTeacher,
  useTeacherQuery,
  useUpdateTeacher,
} from "../../../api-hooks/teacher/api";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { FiEdit } from "react-icons/fi";
import Swal from "sweetalert2";
import { useQueryClient } from "@tanstack/react-query";
import { useAlert } from "../../../contexts/AlertContext";
import { MdArchive, MdUnarchive } from "react-icons/md";

interface TeacherProps {
  search: string;
  paginationModel: PaginationModelProps;
  handleEditTeacher: (data: TeacherModel) => void;
}

function TeacherTable({
  handleEditTeacher,
  paginationModel,
  search,
}: TeacherProps) {
  const { showAlert } = useAlert();
  const queryClient = useQueryClient();
  const { data } = useTeacherQuery({
    pagination: {
      limit: paginationModel.pageSize,
      page: paginationModel.pageNumber,
      sortColumn: paginationModel.sortColumn,
      sortOrder: paginationModel.sortOrder,
    },
    search: search || "",
  });

  const { mutateAsync } = useDeleteTeacher();
  const { mutateAsync: updateTeacherMutate } = useUpdateTeacher();

  const handleDelete = async (id: number) => {
    const modalResult = await Swal.fire({
      title: "Konfirmasi",
      text: "Apakah anda yakin untuk nonaktifkan?",
      icon: "warning",
      confirmButtonText: "Ya",
      showCancelButton: true,
    });
    if (!modalResult.isConfirmed) return;
    const response = await mutateAsync(id);
    if (response.status === 200) {
      queryClient.invalidateQueries({
        queryKey: ["teachers"],
      });
      showAlert({
        title: "Berhasil",
        message: response.message,
        type: "success",
      });
    }
  };

  const handleUnArchive = async (teacherData: TeacherModel) => {
    const response = await updateTeacherMutate({
      ...teacherData,
      deleted_at: null,
    });
    if (response.status === 200) {
      queryClient.invalidateQueries({
        queryKey: ["teachers"],
      });
      showAlert({
        title: "Berhasil aktifkan guru kembali",
        message: response.message,
        type: "success",
      });
    }
  };

  const columns = useMemo<ColumnDef<TeacherModel>[]>(
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
        accessorKey: "identity_no",
        header: () => "NIK",
      },
      {
        accessorKey: "name",
        header: () => "Nama Lengkap",
      },
      {
        accessorKey: "nuptk",
        header: () => "NUPTK",
      },
      {
        accessorKey: "phone",
        header: () => "No. Telepon",
      },
      {
        accessorKey: "level_id",
        header: () => "Jenjang",
        cell: ({ row }) => {
          return (row.original as any)?.level?.name || "";
        },
      },
      {
        accessorKey: "job_title",
        header: () => "Jabatan",
      },
      {
        accessorKey: "deleted_at",
        header: () => "Status",
        cell: ({ row }) => {
          return row.original.deleted_at ? (
            <div className="p-0.5 rounded-lg bg-danger text-center text-sm border text-white">Nonaktif</div>
          ) : (
            <div className="p-0.5 rounded-lg bg-success text-center text-sm border text-white">Aktif</div>
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
                  onClick={() => handleEditTeacher(row.original)}
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

export default TeacherTable;
