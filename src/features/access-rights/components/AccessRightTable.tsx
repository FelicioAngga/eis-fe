import { ColumnDef } from "@tanstack/react-table";
import { AccessRightModel } from "../../../api-hooks/access-rights/models/AccessRightModel";
import Table, { PaginationModelProps } from "../../../components/Table";
import { useMemo } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { useAccessRightQuery } from "../../../api-hooks/access-rights/api";

interface AccessRightTableProps {
  search: string;
  paginationModel: PaginationModelProps;
  handleEdit?: (id: number) => void;
}

function AccessRightTable({ paginationModel, search, handleEdit }: AccessRightTableProps) {
  const { data } = useAccessRightQuery({
    pagination: {
      limit: paginationModel.pageSize,
      page: paginationModel.pageNumber,
      sortColumn: paginationModel.sortColumn,
      sortOrder: paginationModel.sortOrder,
    },
    search: search || "",
  });

  async function handleDelete(id: number) {

  }

  const columns = useMemo<ColumnDef<AccessRightModel>[]>(
    () => [
      {
        accessorKey: "no",
        header: () => "No",
        cell: (info) => info.row.index + 1 + (paginationModel.pageNumber - 1) * paginationModel.pageSize,
        size: 10,
      },
      {
        accessorKey: "name",
        header: () => "Nama Role",
      },
      {
        accessorKey: "action",
        header: () => "Action",
        cell: ({ row }) => (
          <div className="flex gap-2">
            <FiEdit 
              className="size-5 cursor-pointer"
              onClick={() => handleEdit && handleEdit(row.original.id || 0)}
            />
            <FiTrash2
              className="text-danger size-5 cursor-pointer"
              onClick={() => handleDelete(row.original.id || 0)}
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

export default AccessRightTable