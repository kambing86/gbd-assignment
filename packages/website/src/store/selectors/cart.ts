import { createSelector } from "@reduxjs/toolkit";
import { useCallback, useMemo } from "react";
import { useSelector, useStore } from "react-redux";
import { State } from "store";

export const useCartStore = () => {
  return useSelector((state: State) => state.cart);
};

const cartProductSelector = (id: number) =>
  createSelector(
    (state: State) => state.cart.cartProducts[id],
    (state: State) => state.cart.cart[id] || 0,
    (cartProduct, quantity) =>
      cartProduct === undefined ? undefined : { ...cartProduct, quantity },
  );
export const useGetCartProduct = (id: number) => {
  const selector = useMemo(() => cartProductSelector(id), [id]);
  return useSelector(selector);
};

export const useGetCartFromStore = () => {
  const store = useStore<State>();
  return useCallback(() => {
    return store.getState().cart.cart;
  }, [store]);
};
