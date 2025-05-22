import Table, { PaginationModelProps } from '../../../components/Table';
import { TeacherModel } from '../../../api-hooks/teacher/models/TeacherModel';
import { useQueryClient } from '@tanstack/react-query';
import { useAlert } from '../../../contexts/AlertContext';
import { useTeacherQuery } from '../../../api-hooks/teacher/api';
import { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';
import { FiTrash2 } from 'react-icons/fi';

interface TeacherProps {
  search: string;
  paginationModel: PaginationModelProps;
  handleEditTeacher: (data: TeacherModel) => void;
}

function TeacherTable({ handleEditTeacher, paginationModel, search }: TeacherProps) {
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

  const handleDelete = async (id: number) => {}

  const columns = useMemo<ColumnDef<TeacherModel>[]>(
    () => [
      {
        accessorKey: "no",
        header: () => "No",
        cell: (info) => info.row.index + 1 + (paginationModel.pageNumber - 1) * paginationModel.pageSize,
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
      },
      {
        accessorKey: "job_title",
        header: () => "Jabatan",
      },
      {
        accessorKey: "action",
        header: () => "Action",
        cell: ({ row }) => (
          <div>
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
  )
}

export default TeacherTable