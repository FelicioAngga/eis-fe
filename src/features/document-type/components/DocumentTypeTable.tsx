import { useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { FiTrash2 } from "react-icons/fi";
import Swal from "sweetalert2";
import Table, { PaginationModelProps } from "../../../components/Table";
import { useAlert } from "../../../contexts/AlertContext";
import { useDeleteDocumentType, useDocumentTypeQuery } from "../../../api-hooks/document-type/api";
import { formatDateTime } from "../../../utils/formatDate";
import { DocumentTypeModel } from "../../../api-hooks/document-type/models/DocumentTypeModel";

interface DocumentTypeProps {
  search: string;
  paginationModel: PaginationModelProps;
}

function DocumentTypeTable({ paginationModel, search }: DocumentTypeProps) {
  const { showAlert } = useAlert();
  const queryClient = useQueryClient();
  const { mutateAsync: mutateDeleteDocType } = useDeleteDocumentType();
  
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
    const response = await mutateDeleteDocType(id);
    if (response.status === 200) {
      queryClient.invalidateQueries({
        queryKey: ["document-type"],
      });
      showAlert({
        title: "Berhasil",
        message: response.message,
        type: "success",
      });
    }
  };

  const columns = useMemo<ColumnDef<DocumentTypeModel>[]>(
    () => [
      {
        accessorKey: "no",
        header: () => "No",
        cell: (info) => info.row.index + 1 + (paginationModel.pageNumber - 1) * paginationModel.pageSize,
        size: 10,
      },
      {
        accessorKey: "name",
        header: () => "Name",
      },
      {
        accessorKey: "description",
        header: () => "Deskripsi",
        cell: ({ row }) => (<div>{row.original.description || "-"}</div>)
      },
      {
        accessorKey: "created_at",
        header: () => "Dibuat Pada",
        cell: ({ row }) => {
          return formatDateTime(row.original.created_at);
        },
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

export default DocumentTypeTable;
