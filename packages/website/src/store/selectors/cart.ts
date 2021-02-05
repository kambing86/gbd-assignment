import { useCallback, useMemo } from "react";
import { useSelector, useStore } from "react-redux";
import { createSelector } from "reselect";
import { RootState } from "store";

export const useCartStore = () => {
  return useSelector((state: RootState) => state.cart);
};

const cartProductSelector = (id: number) =>
  createSelector(
    (state: RootState) => state.cart.cartProducts[id],
    (state: RootState) => state.cart.cart[id] || 0,
    (cartProduct, quantity) =>
      cartProduct === undefined ? undefined : { ...cartProduct, quantity },
  );
export const useGetCartProduct = (id: number) => {
  const selector = useMemo(() => cartProductSelector(id), [id]);
  return useSelector(selector);
};

export const useGetCartFromStore = () => {
  const store = useStore<RootState>();
  return useCallback(() => {
    return store.getState().cart.cart;
  }, [store]);
};
