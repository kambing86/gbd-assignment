import { useCallback } from "react";
import { useSelector } from "react-redux";
import { State } from "state";

export const useGetOrder = (id: number) => {
  const selector = useCallback(
    (state: State) => state.order.orders.find((o) => o.id === id),
    [id],
  );
  return useSelector(selector);
};
