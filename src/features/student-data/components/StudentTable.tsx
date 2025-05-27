import { useMemo } from 'react'
import Table, { PaginationModelProps } from '../../../components/Table';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useAlert } from '../../../contexts/AlertContext';
import Swal from 'sweetalert2';
import { useDeleteStudent, useStudentsQuery, useUpdateStudent } from '../../../api-hooks/students/api';
import { StudentModel } from '../../../api-hooks/students/models/StudentModel';
import { ColumnDef } from '@tanstack/react-table';
import { MdArchive, MdUnarchive } from 'react-icons/md';
import dayjs from 'dayjs';

interface StudentTableProps {
  search: string;
  paginationModel: PaginationModelProps;
}

function StudentTable({ paginationModel, search }: StudentTableProps) {
  const { showAlert } = useAlert();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { mutateAsync: mutateDeleteStudent } = useDeleteStudent();
  
  const { data } = useStudentsQuery({
    pagination: {
      limit: paginationModel.pageSize,
      page: paginationModel.pageNumber,
      sortColumn: paginationModel.sortColumn,
      sortOrder: paginationModel.sortOrder,
    },
    search: search || "",
  });

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
    const response = await mutateDeleteStudent(id);
    if (response.status === 200) {
      queryClient.invalidateQueries({
        queryKey: ["students"]
      });
      showAlert({
        title: "Berhasil",
        message: response.message,
        type: "success",
      });
    }
  };

  const { mutateAsync: mutateUpdateStudent } = useUpdateStudent();
  const handleUnArchive = async (data: StudentModel) => {
    const response = await mutateUpdateStudent({
      ...data,
      date_of_birth: dayjs(data.date_of_birth).format("YYYY-MM-DD"),
      deleted_at: null,
    });
    if (response.status === 200) {
      queryClient.invalidateQueries({
        queryKey: ["students"],
      });
      showAlert({
        title: "Berhasil aktifkan siswa kembali",
        message: response.message,
        type: "success",
      });
    }
  }

  const columns = useMemo<ColumnDef<StudentModel>[]>(
    () => [
      {
        accessorKey: "no",
        header: () => "No",
        cell: (info) => info.row.index + 1 + (paginationModel.pageNumber - 1) * paginationModel.pageSize,
        size: 10,
      },
      {
        accessorKey: "full_name",
        header: () => "Name Lengkap",
      },
      {
        accessorKey: "nisn",
        header: () => "NISN",
      },
      {
        accessorKey: "nis",
        header: () => "NIS",
      },
      {
        accessorKey: "guardians_name",
        header: () => "Nama Orang Tua / Wali",
        cell: ({ row }) => (
          <div>{row.original.guardians.find(g => g.relation.toLowerCase() === "guardian")?.name || "-"}</div>
        ),
      },
      {
        accessorKey: "guaridans_phone",
        header: () => "No Telp Orang Tua / Wali",
        cell: ({ row }) => (
          <div>{row.original.guardians.find(g => g.relation.toLowerCase() === "guardian")?.phone || "-"}</div>
        ),
      },
      {
        accessorKey: "class",
        header: () => "Kelas",
        cell: () => (
          <div>{"-"}</div>
        ),
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
                  onClick={() => navigate(`/student-data/detail/${row.original.id}`)}
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

export default StudentTable