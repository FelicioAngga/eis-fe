import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import Table, { PaginationModelProps } from "../../../components/Table";
import Swal from "sweetalert2";
import { useAlert } from "../../../contexts/AlertContext";
import { useQueryClient } from "@tanstack/react-query";
import {
  useMarkRegistration,
  useRegistrationQuery,
} from "../../../api-hooks/registration/api";
import { formatDateTime } from "../../../utils/formatDate";
import Button from "../../../components/Button";
import { BsEye } from "react-icons/bs";
import { RegistrationModel } from "../../../api-hooks/registration/models/RegistrationModel";

interface RegistrationTableProps {
  search: string;
  paginationModel: PaginationModelProps;
  handleOpenModal: (data: RegistrationModel) => void;
}

function RegistrationTable({
  handleOpenModal,
  paginationModel,
  search,
}: RegistrationTableProps) {
  const { showAlert } = useAlert();
  const queryClient = useQueryClient();
  const { mutateAsync: mutateMark } = useMarkRegistration();

  const { data } = useRegistrationQuery({
    pagination: {
      limit: paginationModel.pageSize,
      page: paginationModel.pageNumber,
      sortColumn: paginationModel.sortColumn,
      sortOrder: paginationModel.sortOrder,
    },
    search: search || "",
  });

  const handleMark = async (id: number) => {
    const modalResult = await Swal.fire({
      title: "Konfirmasi",
      text: "Apakah anda yakin ingin meninjau dan menerima data ini sebagai murid?",
      icon: "warning",
      confirmButtonText: "Ya",
      showCancelButton: true,
    });
    if (!modalResult.isConfirmed) return;
    const response = await mutateMark(id);
    if (response.status === 200) {
      queryClient.invalidateQueries({
        queryKey: ["applicants"],
      });
      showAlert({
        title: "Berhasil",
        message: response.message,
        type: "success",
      });
    }
  };

  const columns = useMemo<ColumnDef<RegistrationModel>[]>(
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
        accessorKey: "full_name",
        header: () => "Name",
      },
      {
        accessorKey: "address",
        header: () => "Alamat Domisili",
      },
      {
        accessorKey: "religion",
        header: () => "Agama",
      },
      {
        accessorKey: "phone",
        header: () => "No Telp Ortu/Wali",
      },
      {
        accessorKey: "state",
        header: () => "Status",
      },
      {
        accessorKey: "created_at",
        header: () => "Tanggal",
        cell: ({ row }) => formatDateTime(row.original.created_at || ""),
      },
      {
        accessorKey: "view",
        header: () => "View",
        cell: ({ row }) => (
          <div className="">
            <BsEye
              onClick={() => handleOpenModal(row.original)}
              className="cursor-pointer ml-2 text-blue text-xl"
            />
          </div>
        ),
      },
      {
        accessorKey: "action",
        header: () => "Action",
        cell: ({ row }) => (
          <div>
            {row.original.state === "draft" ? (
              <Button onClick={() => handleMark(row.original.id)}>
                Tandai
              </Button>
            ) : (
              <div className="bg-green-400 text-white w-fit px-2 py-1 rounded-lg">Marked</div>
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
  );
}

export default RegistrationTable;
