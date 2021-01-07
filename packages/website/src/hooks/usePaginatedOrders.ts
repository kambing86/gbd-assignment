import { GraphQLGetOrdersQuery } from "graphql/types-and-hooks";
import { useCallback, useEffect } from "react";
import { setOrders, useGetOrder } from "state/useOrderStore";
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
  const result = usePaginatedQuery({
    itemsPerPage,
    paginatedQuery: useGetOrders(),
    mapData,
    dataClicked,
  });
  const { rowsData } = result;
  useEffect(() => {
    if (!rowsData) return;
    setOrders(rowsData.rows);
  }, [rowsData]);
  return { ...result, useGetOrder };
};
