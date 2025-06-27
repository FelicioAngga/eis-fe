import { useMemo } from "react";
import Table, { PaginationModelProps } from "../../../components/Table";
import { TeacherAbsenceCreateModel } from "../../../api-hooks/teacher-absence/models/TeacherAbsenceModel";
import { ColumnDef } from "@tanstack/react-table";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { useDeleteTeacherAbsence, useTeacherAbsenceQuery } from "../../../api-hooks/teacher-absence/api";
import { useQueryClient } from "@tanstack/react-query";
import { useAlert } from "../../../contexts/AlertContext";
import Swal from "sweetalert2";
import { formatDate, formatDateToTime } from "../../../utils/formatDate";
import { usePermissionAccess } from "../../../hooks/useAccessRight";
import { useAuth } from "../../../hooks/useAuth";

interface TeacherAbsenceTableProps {
  search: {name: string; date: string} | null;
  paginationModel: PaginationModelProps;
  handleEdit: (data: TeacherAbsenceCreateModel) => void;
}

function TeacherAbsenceTable({ paginationModel, search, handleEdit }: TeacherAbsenceTableProps) {
  const { showAlert } = useAlert();
  const queryClient = useQueryClient();
  const { getPermissionAccess } = usePermissionAccess();
  const { getUser } = useAuth();
  const user = getUser();
  
  const { data } = useTeacherAbsenceQuery({
    pagination: {
      limit: paginationModel.pageSize,
      page: paginationModel.pageNumber,
      sortColumn: paginationModel.sortColumn,
      sortOrder: paginationModel.sortOrder,
    },
    date: search?.date || "",
    search: search?.name || "",
    ...(user.role_name === "Teacher" ? { userId: user.id } : {})
  });

  const { mutateAsync: mutateDeleteTeacherAbsence } = useDeleteTeacherAbsence();
  const handleDelete = async (id: number) => {
    const modalResult = await Swal.fire({
      title: "Konfirmasi",
      text: "Apakah anda yakin untuk menghapus?",
      icon: "warning",
      confirmButtonText: "Ya",
      showCancelButton: true,
    });
    if (!modalResult.isConfirmed) return;
    const response = await mutateDeleteTeacherAbsence(id);
    if (response.status === 200) {
      queryClient.invalidateQueries({
        queryKey: ["teacher-absences"]
      });
      showAlert({
        title: "Berhasil",
        message: response.message,
        type: "success",
      });
    }
  };

  const columns = useMemo<ColumnDef<TeacherAbsenceCreateModel>[]>(
    () => [
      {
        accessorKey: "no",
        header: () => "No",
        cell: (info) => info.row.index + 1 + (paginationModel.pageNumber - 1) * paginationModel.pageSize,
        size: 10,
      },
      {
        accessorKey: "teacher.nuptk",
        header: () => "NUPTK",
      },
      {
        accessorKey: "teacher.name",
        header: () => "Nama Lengkap",
      },
      {
        accessorKey: "date",
        header: () => "Tanggal Absensi",
        cell: ({ row }) => formatDate(row.original.date)
      },
      {
        accessorKey: "log_in_time",
        header: () => "Scan Masuk",
        cell: ({ row }) => formatDateToTime(row.original.log_in_time || "") || "-"
      },
      {
        accessorKey: "log_out_time",
        header: () => "Scan Keluar",
        cell: ({ row }) => formatDateToTime(row.original.log_out_time || "") || "-"
      },
      {
        accessorKey: "note",
        header: () => "Catatan",
        cell: ({ row }) => row.original.note || "-",
      },
      {
        accessorKey: "remark",
        header: () => "Keterangan",
        cell: ({ row }) => row.original.remark || "-",
      },
      {
        accessorKey: "action",
        header: () => "Action",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            {getPermissionAccess("teacheratt").write && <>
              <FiEdit 
                className="text-primary size-5 cursor-pointer"
                onClick={() => handleEdit(row.original)}
              />
              <FiTrash2
                className="text-danger size-5 cursor-pointer"
                onClick={() => handleDelete(row.original.id || 0)}
              />
            </>}
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

export default TeacherAbsenceTable;
