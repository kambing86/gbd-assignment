import { useCallback, useEffect, useMemo } from "react";
import { dispatch } from "store";
import { CartProducts, Cart as CartType } from "store/models/cart";
import { useGetCartProduct } from "store/selectors/cart";
import { useCartStore, useGetCartFromStore } from "store/selectors/cart";
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
  return useCallback(
    (product: Product) => {
      const cart = getCart();
      const existing = cart[String(product.id)] || 0;
      if (existing >= product.quantity) {
        dispatch.dialog.open({ title: "Sorry", description: "No more stock" });
        return;
      }
      // limit to 10 different types of product
      if (existing === 0 && Object.keys(cart).length === 10) {
        dispatch.dialog.open({
          title: "Sorry",
          description: "We only allow add 10 types of items at once",
        });
        return;
      }
      dispatch.cart.addToCart(product);
    },
    [getCart],
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
    useGetProduct: useGetCartProduct,
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
  useEffect(() => {
    if (!loading && data) {
      dispatch.cart.setCartProducts(data.products);
    }
  }, [loading, data]);
};
