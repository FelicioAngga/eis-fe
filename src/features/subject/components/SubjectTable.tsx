import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { SubjectModel } from "../../../api-hooks/subjects/models/SubjectModel";
import Table, { PaginationModelProps } from "../../../components/Table";
import { useSubjectsQuery } from "../../../api-hooks/subjects/api";
import { FiTrash2 } from "react-icons/fi";

interface SubjectTableProps {
  search: string;
  paginationModel: PaginationModelProps;
}

function SubjectTable({ paginationModel, search }: SubjectTableProps) {
  const { data } = useSubjectsQuery({
    pagination: {
      limit: paginationModel.pageSize,
      page: paginationModel.pageNumber,
      sortColumn: paginationModel.sortColumn,
      sortOrder: paginationModel.sortOrder,
    },
    search: search || "",
  });

  const handleDelete = (id: number) => {
    
    console.log("Delete subject with ID:", id);
  };

  const columns = useMemo<ColumnDef<SubjectModel>[]>(
    () => [
      {
        accessorKey: "no",
        header: () => "No",
        cell: (info) => info.row.index + 1,
        size: 10,
      },
      {
        accessorKey: "name",
        header: () => "Name",
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
    []
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

export default SubjectTable;
