import { createModel } from "@rematch/core";
import { Product } from "hooks/useProducts";
import { isEqual } from "lodash";
import { RootModel } from ".";

const CART_KEY = "cart";

export type Cart = {
  [key: string]: number | undefined;
};

type CartProduct = Omit<Product, "quantity">;

export type CartProducts = {
  [key: number]: CartProduct | undefined;
};

type CartState = {
  cart: Cart;
  cartProducts: CartProducts;
};

const initialState: CartState = {
  cart: getInitialCart(),
  cartProducts: {},
};

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

function getInitialCart() {
  return JSON.parse(localStorage.getItem(CART_KEY) || "{}") as Cart;
}

function saveCart(state: CartState) {
  localStorage.setItem(CART_KEY, JSON.stringify(state.cart));
}

export default createModel<RootModel>()({
  state: initialState,
  reducers: {
    addToCart(state, payload: Product) {
      const product = payload;
      const id = String(product.id);
      const existing = state.cart[id] || 0;
      if (existing < product.quantity) {
        state.cart[id] = existing + 1;
      }
      saveCart(state);
      return state;
    },
    removeFromCart(state, payload: number) {
      const productId = payload;
      const id = String(productId);
      const existing = state.cart[id] || 0;
      const result = existing - 1;
      if (result <= 0) {
        delete state.cart[id];
      } else {
        state.cart[id] = result;
      }
      saveCart(state);
      return state;
    },
    clearCart(state) {
      state.cart = {};
      saveCart(state);
      return state;
    },
    setCartProducts(state, payload: Product[]) {
      const products = payload;
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
      return state;
    },
  },
});
