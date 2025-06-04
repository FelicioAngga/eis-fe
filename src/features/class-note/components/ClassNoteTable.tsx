import { useMemo } from 'react'
import Table, { PaginationModelProps } from '../../../components/Table';
import { useNavigate } from 'react-router-dom';
import { useClassQuery } from '../../../api-hooks/class/api';
import { ClassModel } from '../../../api-hooks/class/models/ClassModel';
import { ColumnDef } from '@tanstack/react-table';
import { FiEye } from 'react-icons/fi';

interface ClassNoteTableProps {
  search: string;
  paginationModel: PaginationModelProps;
}


function ClassNoteTable({ paginationModel, search }: ClassNoteTableProps) {
  const navigate = useNavigate();
  const { data } = useClassQuery({
    pagination: {
      limit: paginationModel.pageSize,
      page: paginationModel.pageNumber,
      sortColumn: paginationModel.sortColumn,
      sortOrder: paginationModel.sortOrder,
    },
    search: search || "",
  });

  const columns = useMemo<ColumnDef<ClassModel>[]>(
    () => [
      {
        accessorKey: "no",
        header: () => "No",
        cell: (info) => info.row.index + 1 + (paginationModel.pageNumber - 1) * paginationModel.pageSize,
        size: 10,
      },
      {
        accessorKey: "display_name",
        header: () => "Name Kelas",
      },
      {
        accessorKey: "homeroom_teacher",
        header: () => "Wali Kelas",
        cell: ({ row }) => row.original?.homeroom_teacher || "-",
      },
      {
        accessorKey: "action",
        header: () => "Detail",
        cell: ({ row }) => (
          <div>
            <FiEye
              className="cursor-pointer size-5"
              onClick={() => navigate(`/class-note/detail/${row.original.id}`)}
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

export default ClassNoteTable;