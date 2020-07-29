import { useCallback } from "react";
import { GraphQLGetOrdersQuery } from "../graphql/types-and-hooks";
import { usePaginatedQuery } from "./helpers/usePaginatedQuery";
import { Order, useGetOrders } from "./useOrder";

export const usePaginatedOrders = (
  itemsPerPage: number,
  dataClicked?: (data?: Order, action?: string) => void,
) => {
  const mapData = useCallback(
    (queryData: GraphQLGetOrdersQuery): GraphQLGetOrdersQuery["orders"] => {
      return queryData.orders;
    },
    [],
  );
  return usePaginatedQuery({
    itemsPerPage,
    paginatedQuery: useGetOrders(),
    mapData,
    dataClicked,
  });
};
