import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import Table, { PaginationModelProps } from "../../../components/Table";
import Swal from "sweetalert2";
import { useAlert } from "../../../contexts/AlertContext";
import { useQueryClient } from "@tanstack/react-query";
import {
  useApproveDocRegistration,
  useApproveRegistration,
  useRegistrationQuery,
  useRejectRegistration,
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
  const { mutateAsync: mutateApprove } = useApproveRegistration();
  const { mutateAsync: mutateApproveDoc } = useApproveDocRegistration();
  const { mutateAsync: mutateReject } = useRejectRegistration();

  const { data } = useRegistrationQuery({
    pagination: {
      limit: paginationModel.pageSize,
      page: paginationModel.pageNumber,
      sortColumn: paginationModel.sortColumn,
      sortOrder: paginationModel.sortOrder,
    },
    search: search || "",
  });

  const handleReject = async (id: number) => {
    const modalResult = await Swal.fire({
      title: "Konfirmasi",
      text: "Berikan Alasan Menolak Data Ini",
      icon: "warning",
      input: "textarea",
      inputPlaceholder: "Masukkan alasan penolakan",
      inputLabel: "Alasan Penolakan",
      confirmButtonText: "Ya",
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) return 'Alasan penolakan harus diisi!';
      }
    });
    if (!modalResult.isConfirmed) return;
    const response = await mutateReject({ id, reason: modalResult.value || "" });
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
  }



  const handleApprove = async (id: number) => {
    const modalResult = await Swal.fire({
      title: "Konfirmasi",
      text: "Apakah anda yakin ingin meninjau dan menerima data ini sebagai murid?",
      icon: "warning",
      confirmButtonText: "Ya",
      showCancelButton: true,
    });
    if (!modalResult.isConfirmed) return;
    const response = await mutateApprove(id);
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
  
  const handleApproveDoc = async (id: number) => {
    const modalResult = await Swal.fire({
      title: "Konfirmasi",
      text: "Apakah anda yakin ingin menyetujui data dokumen siswa agar calon siswa bisa melanjutkan pembayaran?",
      icon: "warning",
      confirmButtonText: "Ya",
      showCancelButton: true,
    });
    if (!modalResult.isConfirmed) return;
    const response = await mutateApproveDoc(id);
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
        header: () => "Nama",
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
        cell: ({ row }) => {
          let state = "";
          if (row.original.state === "draft") {
            state = "Menunggu verifikasi dokumen";
          } else if (row.original.state === "draft_payment") {
            state = "Menunggu verifikasi pembayaran";
          } else if (row.original.state === "approved") {
            state = "Diterima";
          } else if (row.original.state === "rejected") {
            state = "Ditolak";
          }
          return state
        }
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
            {row.original.state === "draft" || row.original.state === "draft_payment" ? (
              <div className="flex gap-2">
                <Button className="bg-danger" onClick={() => handleReject(row.original.id)}>Tolak</Button>
                <Button 
                  onClick={() => {
                    if (row.original.state === "draft") {
                      handleApproveDoc(row.original.id);
                    } else if (row.original.state === "draft_payment") {
                      handleApprove(row.original.id);
                    }
                  }}
                >Setujui</Button>
              </div>
            ) : (
              <div>
                {row.original.state === "rejected" 
                ? <div className="bg-red-400 text-white w-fit px-2 py-1 rounded-lg">Ditolak</div> 
                : <div className="bg-green-400 text-white w-fit px-2 py-1 rounded-lg">Diterima</div>}
              </div>
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
