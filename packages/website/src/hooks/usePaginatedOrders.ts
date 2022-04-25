import { GraphQLGetOrdersQuery } from "graphql/types-and-hooks";
import { useCallback, useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { orderActions } from "store/slices/order.slice";
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
  const dispatch = useDispatch();
  useEffect(() => {
    if (!rowsData) return;
    dispatch(orderActions.setOrders(rowsData.rows));
  }, [rowsData, dispatch]);
  const idsChange = JSON.stringify(rowsData?.rows.map((r) => r.id));
  const orderIds = useMemo(() => {
    return rowsData?.rows.map((r) => r.id) || [];
  }, [idsChange]); // eslint-disable-line react-hooks/exhaustive-deps
  return { ...paginatedResult, orderIds };
};
