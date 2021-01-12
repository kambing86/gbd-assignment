import { useCallback } from "react";
import { useSelector } from "react-redux";
import { State } from "state";

export const useGetProduct = (id: number) => {
  const selector = useCallback((state: State) => state.product[id], [id]);
  return useSelector(selector);
};
