import { Product } from "hooks/useProducts";
import produce from "immer";
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

function getInitialCart() {
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
  getCart: () => Cart;
  addToCart: (product: Product) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  fixCart: (cartProducts: Product[]) => void;
  setCartProduct: (product: CartProduct) => void;
};

function setAndSaveCart(immerUpdate: (state: Store) => void) {
  const updater = produce(immerUpdate);
  return (currentState: Store) => {
    const nextState = updater(currentState);
    localStorage.setItem(CART_KEY, JSON.stringify(nextState.cart));
    return nextState;
  };
}

const useStore = create<Store>(
  (set, get) => ({
    cart: getInitialCart(),
    cartProducts: {},
    getCart: () => get().cart,
    addToCart: (product) => {
      const id = String(product.id);
      const existing = get().cart[id] || 0;
      if (existing < product.quantity) {
        set(
          setAndSaveCart((state) => {
            state.cart[id] = existing + 1;
          }),
          "addToCart",
        );
      }
    },
    removeFromCart: (productId) => {
      const id = String(productId);
      const existing = get().cart[id] || 0;
      const result = existing - 1;
      set(
        setAndSaveCart((state) => {
          if (result <= 0) {
            delete state.cart[id];
          } else {
            state.cart[id] = result;
          }
        }),
        "removeFromCart",
      );
    },
    clearCart: () => {
      set(
        setAndSaveCart((state) => {
          state.cart = {};
        }),
        "clearCart",
      );
    },
    fixCart: (cartProducts) => {
      set(
        setAndSaveCart((state) => {
          for (const key in state.cart) {
            const id = Number(key);
            const product = cartProducts.find((p) => p.id === id);
            if (product) {
              const inCart = state.cart[key] as number;
              if (inCart > product.quantity) {
                state.cart[key] = product.quantity;
              }
              if (!product.isUp) {
                delete state.cart[key];
                continue;
              }
            }
            if (state.cart[key] === 0) {
              delete state.cart[key];
            }
          }
        }),
        "fixCart",
      );
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

export const {
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
  fixCart,
  setCartProduct,
} = useStore.getState();
