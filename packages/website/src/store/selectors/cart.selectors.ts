import { createSelector } from "@reduxjs/toolkit";
import { Product } from "hooks/useProducts";
import { useCallback, useMemo } from "react";
import { useSelector, useStore } from "react-redux";
import { RootState } from "store";

export const useCartStore = () => {
  return useSelector((state: RootState) => state.cart);
};

const cartProductSelector = (id: number) =>
  createSelector(
    (state: RootState) => state.cart.cartProducts[id],
    (state: RootState) => state.cart.cart[id] || 0,
    (cartProduct, quantity) =>
      cartProduct == null ? undefined : { ...cartProduct, quantity },
  );

export const useGetCartProduct = (id: number): Product | undefined => {
  const selector = useMemo(() => cartProductSelector(id), [id]);
  return useSelector(selector);
};

export const useGetCartFromStore = () => {
  const store = useStore<RootState>();
  return useCallback(() => {
    return store.getState().cart.cart;
  }, [store]);
};
