import {
  PayloadAction,
  createDraftSafeSelector,
  createSlice,
} from "@reduxjs/toolkit";
import { Product } from "hooks/useProducts";
import { WritableDraft } from "immer/dist/internal";
import { isEqual } from "lodash";

const CART_KEY = "cart";

export type Cart = {
  [key: number]: number | undefined;
};

type CartProduct = Omit<Product, "quantity">;

export type CartProducts = {
  [key: number]: CartProduct | undefined;
};

function getInitialCart() {
  return JSON.parse(localStorage.getItem(CART_KEY) ?? "{}") as Cart;
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

type CartState = Readonly<{
  cart: Cart;
  cartProducts: CartProducts;
}>;

const initialState: CartState = {
  cart: getInitialCart(),
  cartProducts: {},
};

const cartSelector = createDraftSafeSelector(
  (state: CartState) => state.cart,
  (cart) => cart,
);

function saveCart(state: WritableDraft<CartState>) {
  const cart = cartSelector(state);
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export const cartSlice = createSlice({
  name: CART_KEY,
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<Product>) {
      const { id, quantity } = action.payload;
      const existing = state.cart[id] || 0;
      if (existing < quantity) {
        state.cart[id] = existing + 1;
      }
      saveCart(state);
    },
    removeFromCart(state, action: PayloadAction<number>) {
      const productId = action.payload;
      const existing = state.cart[productId] || 0;
      const result = existing - 1;
      if (result <= 0) {
        delete state.cart[productId];
      } else {
        state.cart[productId] = result;
      }
      saveCart(state);
    },
    clearCart(state) {
      state.cart = {};
      saveCart(state);
    },
    setCartProducts(state, action: PayloadAction<Product[]>) {
      const products = action.payload;
      for (const newProduct of products) {
        const { id } = newProduct;
        const curProduct = state.cartProducts[id];
        const product = cartProductDiff(newProduct, curProduct);
        if (curProduct !== product) {
          state.cartProducts[id] = product;
        }
      }
      const { cart } = state;
      for (const key in cart) {
        const id = Number(key);
        const product = products.find((p) => p.id === id);
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
      saveCart(state);
    },
  },
});

export const cartActions = cartSlice.actions;

export default cartSlice.reducer;
