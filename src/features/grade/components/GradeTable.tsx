import { useMemo } from "react";
import Table, { PaginationModelProps } from "../../../components/Table";
import { ColumnDef } from "@tanstack/react-table";
import { GradeModel } from "../../../api-hooks/grade/models/GradeModel";
import { FiEdit } from "react-icons/fi";
import { useGradeQuery } from "../../../api-hooks/grade/api";

interface GradeTableProps {
  search: string;
  paginationModel: PaginationModelProps;
  handleEdit: (data: GradeModel) => void;
}

function GradeTable({ paginationModel, search, handleEdit }: GradeTableProps) {
  const { data } = useGradeQuery({
    pagination: {
      limit: paginationModel.pageSize,
      page: paginationModel.pageNumber,
      sortColumn: paginationModel.sortColumn,
      sortOrder: paginationModel.sortOrder,
    },
    search: search || "",
  });

  const columns = useMemo<ColumnDef<GradeModel>[]>(
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
        accessorKey: "op_cert_num",
        header: () => "SK Operasional",
        cell: ({ row }) => <div>{row.original.histories[0]?.op_cert_num}</div>,
      },
      {
        accessorKey: "accreditation",
        header: () => "Akreditasi",
        cell: ({ row }) => (
          <div>{row.original.histories[0]?.accreditation}</div>
        ),
      },
      {
        accessorKey: "principle_name",
        header: () => "Kepala Sekolah",
        cell: ({ row }) => <div>{(row.original.histories[0] as any)?.principle?.name}</div>,
      },
      {
        accessorKey: "phone",
        header: () => "No Telp",
        cell: ({ row }) => <div>{row.original.histories[0]?.phone}</div>,
      },
      {
        accessorKey: "email",
        header: () => "Email",
        cell: ({ row }) => <div>{row.original.histories[0]?.email}</div>,
      },
      {
        accessorKey: "action",
        header: () => "Action",
        cell: ({ row }) => (
          <div>
            <FiEdit
              className="size-5 cursor-pointer"
              onClick={() => handleEdit(row.original)}
            />
          </div>
        ),
      },
    ],
    [paginationModel, data]
  );

  const sortedData = useMemo(() => {
    const sorted = data?.data.map((data) => {
      const sortedHistories = [
        ...data.histories.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        ),
      ];
      return {
        ...data,
        currentHistory: sortedHistories[0],
        histories: sortedHistories,
      };
    });
    return sorted;
  }, [data]);

  return (
    <Table
      columns={columns}
      totalRecords={data?.total || 0}
      data={sortedData || []}
      paginationModel={paginationModel}
    />
  );
}

export default GradeTable;
