import { GraphQLGetOrdersQuery } from "graphql/types-and-hooks";
import { useCallback, useEffect } from "react";
import { dispatch } from "store";
import { useGetOrder } from "store/selectors/order";
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
  useEffect(() => {
    if (!rowsData) return;
    dispatch.order.setOrders(rowsData.rows);
  }, [rowsData]);
  return { ...paginatedResult, useGetOrder };
};
