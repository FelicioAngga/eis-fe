import React from "react";

export const usePaginationModel = ({
  sizePage = 10,
  numberPage = 1,
  column = "created_at",
  order = "desc",
}) => {
  const [pageSize, setPageSize] = React.useState(sizePage);
  const [pageNumber, setPageNumber] = React.useState(numberPage);
  const [sortColumn, setSortColumn] = React.useState(column);
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">(
    order as "desc" | "asc"
  );
  const onChangeRowsValue = React.useCallback((value: number) => {
    setPageSize(value);
  }, []);

  const onChangePageValue = React.useCallback((value: number) => {
    setPageNumber(value);
  }, []);

  const onChangeSortColumn = React.useCallback((value: string) => {
    setSortColumn(value);
  }, []);

  const onChangeSortOrder = React.useCallback((value: any) => {
    setSortOrder(value);
  }, []);

  return {
    pageSize,
    pageNumber,
    sortColumn,
    sortOrder,
    onChangePageValue,
    onChangeSortColumn,
    onChangeSortOrder,
    onChangeRowsValue,
  };
};
