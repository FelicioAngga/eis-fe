import { FiEdit } from "react-icons/fi";
import { WorkingScheduleModel } from "../../../api-hooks/working-schedule/models/WorkingScheduleModel";
import Table, { PaginationModelProps } from "../../../components/Table";
import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { useDeleteWorkingSchedule, useUnArchiveWorkingSchedule, useWorkingScheduleQuery } from "../../../api-hooks/working-schedule/api";
import { MdArchive, MdUnarchive } from "react-icons/md";
import { useQueryClient } from "@tanstack/react-query";
import { useAlert } from "../../../contexts/AlertContext";

interface WorkingScheduleProps {
  search: string;
  paginationModel: PaginationModelProps;
  handleEditWorkScheds: (data: WorkingScheduleModel) => void;
}

function WorkingScheduleTable({ handleEditWorkScheds, paginationModel, search }: WorkingScheduleProps) {
  const { showAlert } = useAlert();
  const queryClient = useQueryClient();
  const { data } = useWorkingScheduleQuery({
    pagination: {
      limit: paginationModel.pageSize,
      page: paginationModel.pageNumber,
      sortColumn: paginationModel.sortColumn,
      sortOrder: paginationModel.sortOrder,
    },
    search: search || "",
  });

  const { mutateAsync: deleteMutate } = useDeleteWorkingSchedule();
  const { mutateAsync: unArchiveMutate } = useUnArchiveWorkingSchedule();

  const handleDelete = async (id: number) => {
    const response = await deleteMutate(id);
    if (response.status === 200) {
      queryClient.invalidateQueries({
        queryKey: ["workscheds"],
      });
      showAlert({
        title: "Berhasil",
        message: response.message,
        type: "success",
      });
    }
  }

  const handleUnArchive = async (data: WorkingScheduleModel) => {
    const response = await unArchiveMutate(data.id || 0);
    if (response.status === 200) {
      queryClient.invalidateQueries({
        queryKey: ["workscheds"],
      });
      showAlert({
        title: "Berhasil",
        message: response.message,
        type: "success",
      });
    }
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
          return row.original.deleted_at ? (
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
            {row.original.deleted_at ? (
              <MdUnarchive
                className="text-blue size-5 cursor-pointer"
                onClick={() => handleUnArchive(row.original)}
              />
            ) : (
              <>
                <FiEdit
                  className="size-5 cursor-pointer"
                  onClick={() => handleEditWorkScheds(row.original)}
                />

                <MdArchive
                  className="text-danger size-5 cursor-pointer"
                  onClick={() => handleDelete(row.original.id || 0)}
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
  )
}

export default WorkingScheduleTable;
