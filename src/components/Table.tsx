import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Table as AntdTable, TablePaginationConfig } from "antd";
import { v4 as uuidv4 } from 'uuid';

export interface PaginationModelProps {
  pageSize: number;
  pageNumber: number;
  sortColumn: string;
  sortOrder: "asc" | "desc";
  onChangePageValue: (value: number) => void;
  onChangeSortColumn: (value: string) => void;
  onChangeSortOrder: (value: any) => void;
  onChangeRowsValue: (value: number) => void;
}

interface Props {
  columns: ColumnDef<any>[];
  data: any[];
  totalRecords: number;
  paginationModel: PaginationModelProps;
}

export default function Table(props: Props) {
  const { columns, data, paginationModel, totalRecords } = props;
  const {
    pageNumber,
    pageSize,
    onChangePageValue,
    onChangeRowsValue,
    onChangeSortColumn,
    onChangeSortOrder,
  } = paginationModel;

 
  const table = useReactTable({
    columns,
    columnResizeDirection : 'ltr',
    columnResizeMode: 'onChange',
    data,
    getCoreRowModel: getCoreRowModel(),
  });

  const antdColumns = table.getHeaderGroups()[0].headers.map((header) => {
    const columnId = header.column.id;
    const colDef = header.column.columnDef;
    return {
      title: flexRender(header.column.columnDef.header, header.getContext()),
      dataIndex: columnId,
      key: columnId,
      sorter: colDef.enableSorting ?? false,
      width: colDef.size ?? undefined,
    };
  });

  const handleChange = (pagination: TablePaginationConfig, _filters: any, sorter: any) => {
    const { current = 1, pageSize = 10 } = pagination;

    if (sorter && sorter.field) {
      onChangeSortColumn(sorter.field);
      onChangeSortOrder(sorter.order === "ascend" ? "asc" : "desc");
    }
    
    onChangePageValue(current);
    onChangeRowsValue(pageSize);
  };

  const pagination: TablePaginationConfig = {
    current: pageNumber,
    pageSize,
    total: totalRecords,
    showSizeChanger: true,
    pageSizeOptions: ["10", "20", "50", "100"],
  };

  const dataWithKeys = table.getRowModel().rows.map((row) => {
    const rowData: Record<string, any> = {};
    row.getVisibleCells().forEach((cell) => {
      rowData[cell.column.id] = flexRender(cell.column.columnDef.cell, cell.getContext());
    });
    rowData.key = rowData.id ?? rowData.key ?? uuidv4();
    return rowData;
  });
  
  return (
    <AntdTable
      rowKey="key"
      columns={antdColumns}
      dataSource={dataWithKeys}
      pagination={pagination}
      onChange={handleChange}
    />
  );
}