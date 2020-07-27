import { useCallback } from "react";
import { RowsData, usePaginatedQuery } from "./helpers/usePaginatedQuery";
import { GetOrdersData, Order, useGetOrders } from "./useOrder";

export const usePaginatedOrders = (
  itemsPerPage: number,
  dataClicked?: (data?: Order, action?: string) => void,
) => {
  const mapData = useCallback((queryData: GetOrdersData): RowsData<Order> => {
    return queryData.orders;
  }, []);
  return usePaginatedQuery({
    itemsPerPage,
    paginatedQuery: useGetOrders(),
    mapData,
    dataClicked,
  });
};
