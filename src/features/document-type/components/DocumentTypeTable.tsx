import { useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { FiTrash2 } from "react-icons/fi";
import Swal from "sweetalert2";
import { useDeleteSubject } from "../../../api-hooks/subjects/api";
import { SubjectModel } from "../../../api-hooks/subjects/models/SubjectModel";
import Table, { PaginationModelProps } from "../../../components/Table";
import { useAlert } from "../../../contexts/AlertContext";
import { useDocumentTypeQuery } from "../../../api-hooks/document-type/api";

interface DocumentTypeProps {
  search: string;
  paginationModel: PaginationModelProps;
}

function DocumentTypeTable({ paginationModel, search }: DocumentTypeProps) {
  const { showAlert } = useAlert();
  const queryClient = useQueryClient();
  const { mutateAsync: mutateDeleteSubject } = useDeleteSubject();
  
  const { data } = useDocumentTypeQuery({
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
        cell: (info) => info.row.index + 1,
        size: 10,
      },
      {
        accessorKey: "name",
        header: () => "Name",
        enableSorting: true,
      },
      {
        accessorKey: "name",
        header: () => "Deskripsi",
        enableSorting: true,
      },
      {
        accessorKey: "created_by",
        header: () => "Dibuat Oleh",
        enableSorting: true,
      },
      {
        accessorKey: "created_at",
        header: () => "Dibuat Pada",
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

export default DocumentTypeTable;
