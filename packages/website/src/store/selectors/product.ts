import { useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "store";

export const useGetProduct = (id: number) => {
  const selector = useCallback((state: RootState) => state.product[id], [id]);
  return useSelector(selector);
};
