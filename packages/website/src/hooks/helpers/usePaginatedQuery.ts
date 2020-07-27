import { LazyQueryResult } from "@apollo/client";
import {
  MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type PaginatedQuery<T, V> = [
  LazyQueryResult<T, V>,
  (skip: number, limit: number) => void,
];

type Data = {
  id: number;
};

export type RowsData<D extends Data> = {
  rows: D[];
  total: number;
  limit: number;
};

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
  const rowsDataRef = useRef<D[] | undefined>(rowsData?.rows);
  rowsDataRef.current = rowsData?.rows;
  const itemClickHandler = useCallback(
    (event: MouseEvent) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const dataset = event.currentTarget.dataset as Dataset;
      const id = Number(dataset.id);
      const action = dataset.action;
      const product = rowsDataRef.current?.find((r) => r.id === id);
      dataClicked?.(product, action);
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
