import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { SubjectModel } from "../../../api-hooks/subjects/models/SubjectModel";
import Table, { PaginationModelProps } from "../../../components/Table";
import { useDeleteSubject, useSubjectsQuery } from "../../../api-hooks/subjects/api";
import { FiTrash2 } from "react-icons/fi";
import Swal from 'sweetalert2'
import { useAlert } from "../../../contexts/AlertContext";
import { useQueryClient } from "@tanstack/react-query";

interface SubjectTableProps {
  search: string;
  paginationModel: PaginationModelProps;
}

function SubjectTable({ paginationModel, search }: SubjectTableProps) {
  const { showAlert } = useAlert();
  const queryClient = useQueryClient();
  const { mutateAsync: mutateDeleteSubject } = useDeleteSubject();
  
  const { data } = useSubjectsQuery({
    pagination: {
      limit: paginationModel.pageSize,
      page: paginationModel.pageNumber,
      sortColumn: paginationModel.sortColumn,
      sortOrder: paginationModel.sortOrder,
    },
    search: search || "",
  });

  const handleDelete = async (id: number) => {
    const modalResult = await Swal.fire({
      title: "Konfirmasi",
      text: "Apakah anda yakin untuk menghapus?",
      icon: "warning",
      confirmButtonText: "Ya",
      showCancelButton: true,
    });
    if (!modalResult.isConfirmed) return;
    const response = await mutateDeleteSubject(id);
    if (response.status === 200) {
      queryClient.invalidateQueries({
        queryKey: ["subjects"]
      });
      showAlert({
        title: "Berhasil",
        message: response.message,
        type: "success",
      });
    }
  };

  const columns = useMemo<ColumnDef<SubjectModel>[]>(
    () => [
      {
        accessorKey: "no",
        header: () => "No",
        cell: (info) => info.row.index + 1 + (paginationModel.pageNumber - 1) * paginationModel.pageSize,
        size: 10,
      },
      {
        accessorKey: "name",
        header: () => "Nama",
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
  );
}

export default SubjectTable;
