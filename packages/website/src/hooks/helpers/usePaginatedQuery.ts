import { LazyQueryResult } from "@apollo/client";
import { MouseEvent, useCallback, useEffect, useState } from "react";
import { useRefInSync } from "./useRefInSync";

interface Data {
  id: number;
}

export interface RowsData<D extends Data> {
  rows: D[];
  total: number;
  limit: number;
}

type Options<D extends Data, T, V> = {
  itemsPerPage: number;
  paginatedResult: LazyQueryResult<T, V>;
  paginatedQuery: (skip: number, limit: number) => void;
  mapData: (queryData: T) => RowsData<D>;
  dataClicked?: (data?: D, action?: string) => void;
};

export const usePaginatedQuery = <D extends Data, T, V>(
  options: Options<D, T, V>,
) => {
  const {
    itemsPerPage,
    paginatedResult,
    paginatedQuery,
    mapData,
    dataClicked,
  } = options;
  const [page, setPage] = useState(1);
  useEffect(() => {
    paginatedQuery(itemsPerPage * (page - 1), itemsPerPage);
  }, [paginatedQuery, page, itemsPerPage]);
  const { loading, data } = paginatedResult;
  const rowsData = data ? mapData(data) : undefined;
  const enablePrevPage = page !== 1;
  const enableNextPage = Boolean(
    rowsData && rowsData.total > page * rowsData.limit,
  );
  const rowsDataRef = useRefInSync(rowsData?.rows);
  const itemClickHandler = useCallback(
    (id: number, action?: string) => {
      const rowData = rowsDataRef.current?.find((r) => r.id === id);
      dataClicked?.(rowData, action);
    },
    [rowsDataRef, dataClicked],
  );
  const prevPageHandler = useCallback((e: MouseEvent) => {
    e.preventDefault();
    setPage((p) => p - 1);
  }, []);
  const nextPageHandler = useCallback((e: MouseEvent) => {
    e.preventDefault();
    setPage((p) => p + 1);
  }, []);
  return {
    rowsData,
    loading,
    hasData: (rowsData?.rows.length ?? 0) > 0,
    page,
    enablePrevPage,
    enableNextPage,
    itemClickHandler,
    prevPageHandler,
    nextPageHandler,
  };
};
