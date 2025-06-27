import { FiEye } from "react-icons/fi";
import Table, { PaginationModelProps } from "../../../components/Table";
import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ClassModel } from "../../../api-hooks/class/models/ClassModel";
import { useClassQuery } from "../../../api-hooks/class/api";
import { useNavigate } from "react-router-dom";

interface ClassTableProps {
  search: string;
  paginationModel: PaginationModelProps;
}

function ClassTable({ paginationModel, search }: ClassTableProps) {
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
        header: () => "Nama Akademik",
      },
      {
        accessorKey: "level_name",
        header: () => "Jenjang",
        cell: ({ row }) => row.original?.level_name || "-",
      },
      {
        accessorKey: "major",
        header: () => "Jurusan",
      },
      {
        accessorKey: "curriculum",
        header: () => "Kurikulum",
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
              onClick={() => navigate(`/academic/detail/${row.original.id}`)}
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

export default ClassTable;
