import { FiEdit, FiTrash2 } from "react-icons/fi";
import { WorkingScheduleModel } from "../../../api-hooks/working-schedule/models/WorkingScheduleModel";
import Table, { PaginationModelProps } from "../../../components/Table";
import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { useWorkingScheduleQuery } from "../../../api-hooks/working-schedule/api";

interface WorkingScheduleProps {
  search: string;
  paginationModel: PaginationModelProps;
  handleEditTeacher: (data: WorkingScheduleModel) => void;
}

function WorkingScheduleTable({ handleEditTeacher, paginationModel, search }: WorkingScheduleProps) {
  const { data } = useWorkingScheduleQuery({
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

  const columns = useMemo<ColumnDef<WorkingScheduleModel>[]>(
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
        accessorKey: "name",
        header: () => "Nama",
      },
      {
        accessorKey: "deleted_at",
        header: () => "Status",
        cell: ({ row }) => {
          return row.original ? (
            <div className="w-fit px-2 py-1 rounded-lg bg-danger text-center text-xs border text-white">Nonaktif</div>
          ) : (
            <div className="w-fit px-2 py-1 rounded-lg bg-success text-center text-xs border text-white">Aktif</div>
          );
        },
      },
      {
        accessorKey: "action",
        header: () => "Action",
        cell: ({ row }) => (
          <div className="flex gap-2">
            <FiEdit
              className="size-5 cursor-pointer"
              onClick={() => handleEditTeacher(row.original)}
            />
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

export default WorkingScheduleTable;
