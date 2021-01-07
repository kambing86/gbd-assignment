import { LazyQueryResult } from "@apollo/client";
import { MouseEvent, useCallback, useEffect, useState } from "react";
import { useRefInSync } from "./useRefInSync";

type PaginatedQuery<T, V> = [
  LazyQueryResult<T, V>,
  (skip: number, limit: number) => void,
];

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
  paginatedQuery: PaginatedQuery<T, V>;
  mapData: (queryData: T) => RowsData<D>;
  dataClicked?: (data?: D, action?: string) => void;
};

export const usePaginatedQuery = <D extends Data, T, V>(
  options: Options<D, T, V>,
) => {
  const { itemsPerPage, paginatedQuery, mapData, dataClicked } = options;
  const [result, getQuery] = paginatedQuery;
  const [page, setPage] = useState(1);
  useEffect(() => {
    getQuery(itemsPerPage * (page - 1), itemsPerPage);
  }, [getQuery, page, itemsPerPage]);
  const { loading, data } = result;
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
    page,
    enablePrevPage,
    enableNextPage,
    itemClickHandler,
    prevPageHandler,
    nextPageHandler,
  };
};
