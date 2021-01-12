import { GraphQLGetOrdersQuery } from "graphql/types-and-hooks";
import { useCallback, useEffect } from "react";
import { useGetOrder } from "state/selector/order";
import { useSetOrders } from "state/slice/order";
import { usePaginatedQuery } from "./helpers/usePaginatedQuery";
import { Order, useGetOrders } from "./useOrder";

interface options {
  itemsPerPage: number;
  dataClicked?: (data?: Order, action?: string) => void;
}

export const usePaginatedOrders = ({ itemsPerPage, dataClicked }: options) => {
  const mapData = useCallback(
    (queryData: GraphQLGetOrdersQuery): GraphQLGetOrdersQuery["orders"] => {
      return queryData.orders;
    },
    [],
  );
  const { result, getOrders } = useGetOrders();
  const paginatedResult = usePaginatedQuery({
    itemsPerPage,
    paginatedResult: result,
    paginatedQuery: getOrders,
    mapData,
    dataClicked,
  });
  const { rowsData } = paginatedResult;
  const setOrders = useSetOrders();
  useEffect(() => {
    if (!rowsData) return;
    setOrders(rowsData.rows);
  }, [rowsData, setOrders]);
  return { ...paginatedResult, useGetOrder };
};
