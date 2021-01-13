import { useCallback, useEffect, useMemo } from "react";
import { useGetCartProduct } from "state/selector/cart";
import { useCartStore, useGetCartFromStore } from "state/selector/cart";
import {
  CartProducts,
  Cart as CartType,
  useAddToCart as useAddProduct,
  useFixCart,
  useSetCartProducts,
} from "state/slice/cart";
import { useOpen } from "state/slice/dialog";
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
  const open = useOpen();
  const addProduct = useAddProduct();
  const getCart = useGetCartFromStore();
  return useCallback(
    (product: Product) => {
      const cart = getCart();
      const existing = cart[String(product.id)] || 0;
      if (existing >= product.quantity) {
        open({ title: "Sorry", description: "No more stock" });
        return;
      }
      // limit to 10 different types of product
      if (existing === 0 && Object.keys(cart).length === 10) {
        open({
          title: "Sorry",
          description: "We only allow add 10 types of items at once",
        });
        return;
      }
      addProduct(product);
    },
    [getCart, open, addProduct],
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
  const cartRef = useRefInSync(cart);
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
      let allReady = true;
      for (const id of ids) {
        if (!readyIds.includes(id)) {
          allReady = false;
        }
      }
      if (allReady) {
        return;
      }
    }
    getProductsByIds(ids);
  }, [cart, calledRef, cartProductsRef, getProductsByIds]);
  const setCartProducts = useSetCartProducts();
  const fixCart = useFixCart();
  useEffect(() => {
    if (!loading && data) {
      const { products } = data;
      const currentCart = cartRef.current;
      const valid = products.every((p) => {
        const inCart = currentCart[String(p.id)];
        // not in cart, skip checking
        if (inCart === undefined) return true;
        // in cart but not available
        if (!p.isUp) return false;
        // in cart but cart quantity is more than stock
        if (p.quantity < inCart) return false;
        return true;
      });
      if (valid) {
        setCartProducts(products);
      } else {
        fixCart(products);
      }
    }
  }, [loading, data, cartRef, setCartProducts, fixCart]);
};
