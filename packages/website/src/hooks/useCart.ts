import { useCallback, useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import {
  useCartStore,
  useGetCartFromStore,
} from "store/selectors/cart.selectors";
import {
  CartProducts,
  Cart as CartType,
  cartActions,
} from "store/slices/cart.slice";
import { dialogActions } from "store/slices/dialog.slice";
import { useRefInSync } from "./helpers/useRefInSync";
import { Product, useGetProductsByIds } from "./useProducts";

export type Cart = CartType;

export const totalCartCount = (cart: Cart) => {
  let count = 0;
  for (const id in cart) {
    count += cart[id] as number;
  }
  return count;
};

export const totalAmountCount = (cart: Cart, cartProducts: CartProducts) => {
  let amount = 0;
  for (const id in cart) {
    const quantity = cart[id] as number;
    const product = cartProducts[Number(id)];
    if (product === undefined) continue;
    amount += quantity * product.price;
  }
  return amount;
};

export const useAddToCart = () => {
  const getCart = useGetCartFromStore();
  const dispatch = useDispatch();
  return useCallback(
    (product: Product) => {
      const cart = getCart();
      const existing = cart[product.id] || 0;
      if (existing >= product.quantity) {
        dispatch(
          dialogActions.open({ title: "Sorry", description: "No more stock" }),
        );
        return;
      }
      // limit to 10 different types of product
      if (existing === 0 && Object.keys(cart).length === 10) {
        dispatch(
          dialogActions.open({
            title: "Sorry",
            description: "We only allow add 10 types of items at once",
          }),
        );
        return;
      }
      dispatch(cartActions.addToCart(product));
    },
    [getCart, dispatch],
  );
};

export const useGetCart = () => {
  const { cart, cartProducts } = useCartStore();
  const idsChange = JSON.stringify(Object.keys(cart));
  const productIds = useMemo(() => {
    return Object.keys(cart).map((id) => Number(id));
  }, [idsChange]); // eslint-disable-line react-hooks/exhaustive-deps
  const isReady = useMemo(() => {
    const readyIds = Object.keys(cartProducts).map((id) => Number(id));
    return productIds.every((id) => readyIds.includes(id));
  }, [cartProducts, productIds]);
  return {
    cart,
    cartProducts,
    productIds,
    isReady,
  };
};

export const useCheckCart = () => {
  const { cart, cartProducts } = useGetCart();
  const cartProductsRef = useRefInSync(cartProducts);
  const { result, getProductsByIds } = useGetProductsByIds();
  const { called, loading, data } = result;
  const calledRef = useRefInSync(called);

  // only triggered when cart changed
  useEffect(() => {
    const ids = Object.keys(cart).map((id) => Number(id));
    if (calledRef.current) {
      const readyIds = Object.keys(cartProductsRef.current).map((id) =>
        Number(id),
      );
      const allReady = ids.every((id) => readyIds.includes(id));
      if (allReady) {
        return;
      }
    }
    getProductsByIds(ids);
  }, [cart, calledRef, cartProductsRef, getProductsByIds]);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!loading && data) {
      dispatch(cartActions.setCartProducts(data.products));
    }
  }, [loading, data, dispatch]);
};
