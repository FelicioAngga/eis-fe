import { ColumnDef } from "@tanstack/react-table";
import { useCurriculumQuery } from "../../../api-hooks/curriculum/api";
import { CurriculumModel } from "../../../api-hooks/curriculum/models/CurriculumModel";
import Table, { PaginationModelProps } from "../../../components/Table";
import { useMemo } from "react";
import { FiTrash2 } from "react-icons/fi";

interface CurriculumTableProps {
  search: string;
  paginationModel: PaginationModelProps;
}

function CurriculumTable({ paginationModel, search }: CurriculumTableProps) {
  const { data } = useCurriculumQuery({
    pagination: {
      limit: paginationModel.pageSize,
      page: paginationModel.pageNumber,
      sortColumn: paginationModel.sortColumn,
      sortOrder: paginationModel.sortOrder,
    },
    search: search || "",
  });

  const handleDelete = async (id: number) => {
    
  }

  const columns = useMemo<ColumnDef<CurriculumModel>[]>(
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

export default CurriculumTable;
