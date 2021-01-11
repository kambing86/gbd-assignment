import { Product } from "hooks/useProducts";
import produce from "immer";
import { isEqual } from "lodash";
import { useCallback } from "react";
import { CustomSetState, create } from "state";
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

function setAndSaveCart(set: CustomSetState<Store>) {
  return (immerUpdate: (cart: Cart) => Cart | void, actionName: string) => {
    const updater = produce(immerUpdate);
    set((state) => {
      const nextCart = updater(state.cart);
      localStorage.setItem(CART_KEY, JSON.stringify(nextCart));
      return { ...state, cart: nextCart };
    }, actionName);
  };
}

const useStore = create<Store>((set, get) => {
  const saveCart = setAndSaveCart(set);
  return {
    cart: getInitialCart(),
    cartProducts: {},
    getCart: () => get().cart,
    addToCart: (product) => {
      const id = String(product.id);
      const existing = get().cart[id] || 0;
      if (existing < product.quantity) {
        saveCart((cart) => {
          cart[id] = existing + 1;
        }, "addToCart");
      }
    },
    removeFromCart: (productId) => {
      const id = String(productId);
      const existing = get().cart[id] || 0;
      const result = existing - 1;
      saveCart((cart) => {
        if (result <= 0) {
          delete cart[id];
        } else {
          cart[id] = result;
        }
      }, "removeFromCart");
    },
    clearCart: () => {
      saveCart(() => {
        return {};
      }, "clearCart");
    },
    fixCart: (cartProducts) => {
      saveCart((cart) => {
        for (const key in cart) {
          const id = Number(key);
          const product = cartProducts.find((p) => p.id === id);
          if (product) {
            const inCart = cart[key] as number;
            if (inCart > product.quantity) {
              cart[key] = product.quantity;
            }
            if (!product.isUp) {
              delete cart[key];
              continue;
            }
          }
          if (cart[key] === 0) {
            delete cart[key];
          }
        }
      }, "fixCart");
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
  };
}, CART_KEY);

const stateSelector = ({ cart, cartProducts }: Store) => ({
  cart,
  cartProducts,
});

const useCartStore = () => useStore(stateSelector, shallow);

export default useCartStore;
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
