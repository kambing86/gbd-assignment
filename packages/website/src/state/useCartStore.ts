import { Product } from "hooks/useProducts";
import { isEqual } from "lodash";
import { useCallback } from "react";
import { create } from "state";
import shallow from "zustand/shallow";

const CART_KEY = "cart";

export type Cart = {
  [key: string]: number | undefined;
};

type CartProduct = Omit<Product, "quantity">;

export type CartProducts = {
  [key: number]: CartProduct | undefined;
};

function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY) || "{}") as Cart;
}

function cartProductDiff(newProduct: CartProduct, currProduct?: CartProduct) {
  if (currProduct === undefined) {
    return newProduct;
  }
  if (newProduct.id !== currProduct.id) {
    return currProduct;
  }
  if (!isEqual(newProduct, currProduct)) {
    return newProduct;
  }
  return currProduct;
}

type Store = {
  cart: Cart;
  cartProducts: CartProducts;
  setCart: (updater: (prev: Cart) => Cart) => void;
  setCartProduct: (product: CartProduct) => void;
};

const useStore = create<Store>(
  (set, get) => ({
    cart: getCart(),
    cartProducts: {},
    setCart: (updater) => {
      const prev = get();
      const nextCart = updater(prev.cart);
      if (nextCart !== prev.cart) {
        localStorage.setItem(CART_KEY, JSON.stringify(nextCart));
        set({ cart: nextCart }, "setCart");
      }
    },
    setCartProduct: (newProduct) => {
      const { id } = newProduct;
      const curProduct = get().cartProducts[id];
      const product = cartProductDiff(newProduct, curProduct);
      if (curProduct !== product) {
        set((state) => {
          state.cartProducts[id] = product;
        }, "setCartProduct");
      }
    },
  }),
  CART_KEY,
);

const stateSelector = ({ cart, cartProducts }: Store) => ({
  cart,
  cartProducts,
});

export default () => {
  return useStore(stateSelector, shallow);
};

export const useGetCartProduct = (id: number) => {
  const cartProduct = useStore(
    useCallback((state: Store) => state.cartProducts[id], [id]),
  );
  const quantity =
    useStore(useCallback((state: Store) => state.cart[id], [id])) || 0;
  return cartProduct !== undefined
    ? {
        ...cartProduct,
        quantity,
      }
    : undefined;
};

export const { setCart, setCartProduct } = useStore.getState();
