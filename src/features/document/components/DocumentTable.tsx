import { useMemo } from 'react'
import Table, { PaginationModelProps } from '../../../components/Table';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { ColumnDef } from '@tanstack/react-table';
import { DocumentModel } from '../../../api-hooks/documents/models/DocumentModel';
import { formatDateTime } from '../../../utils/formatDate';
import { useDeleteDocument, useDocumentQuery } from '../../../api-hooks/documents/api';
import { useQueryClient } from '@tanstack/react-query';
import { useAlert } from '../../../contexts/AlertContext';
import Swal from 'sweetalert2';

interface DocumentProps {
  search: string;
  paginationModel: PaginationModelProps;
  handleEditDoc: (data: DocumentModel) => void;
}

function DocumentTable({ handleEditDoc, paginationModel, search }: DocumentProps) {
  const { showAlert } = useAlert();
  const queryClient = useQueryClient();
  const { mutateAsync: mutateDeleteDocType } = useDeleteDocument();
  
  const { data } = useDocumentQuery({
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
        queryKey: ["documents"],
      });
      showAlert({
        title: "Berhasil",
        message: response.message,
        type: "success",
      });
    }
  };

  const columns = useMemo<ColumnDef<DocumentModel>[]>(
    () => [
      {
        accessorKey: "no",
        header: () => "No",
        cell: (info) => info.row.index + 1 + (paginationModel.pageNumber - 1) * paginationModel.pageSize,
        size: 10,
      },
      {
        accessorKey: "name",
        header: () => "Dokumen",
      },
      {
        accessorKey: "type_name",
        header: () => "Tipe",
        cell: ({ row }) => (<div>{(row.original as any)?.type?.name || "-"}</div>)
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
          <div className="flex gap-2">
            <FiEdit
              className="size-5 cursor-pointer"
              onClick={() => handleEditDoc(row.original)}
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
  );
}

export default DocumentTable