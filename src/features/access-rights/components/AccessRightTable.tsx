import { ColumnDef } from "@tanstack/react-table";
import { AccessRightModel } from "../../../api-hooks/access-rights/models/AccessRightModel";
import Table, { PaginationModelProps } from "../../../components/Table";
import { useMemo } from "react";
import { FiTrash2 } from "react-icons/fi";
import { useAccessRightQuery } from "../../../api-hooks/access-rights/api";

interface AccessRightTableProps {
  search: string;
  paginationModel: PaginationModelProps;
}

function AccessRightTable({ paginationModel, search }: AccessRightTableProps) {
  const { data } = useAccessRightQuery({
    pagination: {
      limit: paginationModel.pageSize,
      page: paginationModel.pageNumber,
      sortColumn: paginationModel.sortColumn,
      sortOrder: paginationModel.sortOrder,
    },
    search: search || "",
  });

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
          <div>
            <FiTrash2
              className="text-danger size-5 cursor-pointer"
              // onClick={() => handleDelete(row.original.id)}
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