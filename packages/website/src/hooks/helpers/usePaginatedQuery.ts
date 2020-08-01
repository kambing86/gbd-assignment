import { LazyQueryResult } from "@apollo/client";
import { MouseEvent, useCallback, useEffect, useMemo, useState } from "react";
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

// itemClickHandler is binded to item with data-id={id}
// pageClickHandler is binded to button with data-action="prev"|"next"
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
  const enableNextPage = useMemo(() => {
    if (!rowsData) return false;
    return Boolean(rowsData.total > page * rowsData.limit);
  }, [rowsData, page]);
  const rowsDataRef = useRefInSync(rowsData?.rows);
  const itemClickHandler = useCallback(
    (event: MouseEvent) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const dataset = event.currentTarget.dataset as Dataset;
      const id = Number(dataset.id);
      const action = dataset.action;
      const rowData = rowsDataRef.current?.find((r) => r.id === id);
      dataClicked?.(rowData, action);
    },
    [rowsDataRef, dataClicked],
  );
  const pageClickHandler = useCallback(
    (event: MouseEvent) => {
      event.preventDefault();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (event.currentTarget.dataset.action === "next") {
        setPage((p) => p + 1);
      } else {
        setPage((p) => p - 1);
      }
    },
    [setPage],
  );
  return {
    rowsData,
    loading,
    page,
    enablePrevPage,
    enableNextPage,
    itemClickHandler,
    pageClickHandler,
  };
};
