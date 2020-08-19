import { produce } from "immer";
import { useCallback, useEffect } from "react";
import create from "zustand";
import { useRefInSync } from "./helpers/useRefInSync";
import { useSetDialog } from "./useDialog";
import { Product, useGetProductsByIds } from "./useProducts";

const CART_KEY = "cart";

function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY) || "{}") as Cart;
}

export interface Cart {
  [key: string]: number | undefined;
}

type CartProduct = Omit<Product, "quantity">;

interface CartProducts {
  [key: number]: CartProduct | undefined;
}

interface Store {
  cart: Cart;
  cartProducts: CartProducts;
}

const useStore = create<Store>(() => ({
  cart: getCart(),
  cartProducts: {},
}));

const saveAndSetCart = (updater: (prev: Cart) => Cart) => {
  useStore.setState((prev) => {
    const nextCart = updater(prev.cart);
    localStorage.setItem(CART_KEY, JSON.stringify(nextCart));
    return { cart: nextCart };
  });
};

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

// limit to 10 different types of product
export const useSetCart = () => {
  const { open } = useSetDialog();
  const addToCart = useCallback(
    (product: Product) => {
      const id = String(product.id);
      saveAndSetCart((prev) => {
        const existing = prev[id] ?? 0;
        if (product.quantity <= existing) {
          open("Sorry", "No more stock");
          return prev;
        }
        if (existing) {
          return {
            ...prev,
            [id]: existing + 1,
          };
        }
        // limit to 10 different types of product
        if (Object.keys(prev).length === 10) {
          open("Sorry", "We only allow add 10 types of items at once");
          return prev;
        }
        return {
          ...prev,
          [id]: 1,
        };
      });
    },
    [open],
  );
  const removeFromCart = useCallback((id: number) => {
    saveAndSetCart((prev) => {
      let returnObj = { ...prev };
      const quantity = prev[id];
      if (quantity) {
        returnObj = {
          ...prev,
          [id]: quantity - 1,
        };
      }
      if (returnObj[id] === 0) {
        delete returnObj[id];
      }
      return returnObj;
    });
  }, []);
  const fixCart = useCallback((cartProducts: Product[]) => {
    saveAndSetCart((prev) => {
      const cartObj = { ...prev };
      for (const key in cartObj) {
        const inCart = cartObj[key] as number;
        const id = Number(key);
        const product = cartProducts.find((p) => p.id === id);
        if (product) {
          if (inCart > product.quantity) {
            cartObj[key] = product.quantity;
          }
          if (!product.isUp) {
            delete cartObj[key];
            continue;
          }
        }
        if (cartObj[key] === 0) {
          delete cartObj[key];
        }
      }
      return cartObj;
    });
  }, []);
  const clearCart = useCallback(() => {
    saveAndSetCart(() => ({}));
  }, []);
  return { addToCart, removeFromCart, fixCart, clearCart };
};

function cartProductDiff(newProduct: CartProduct, currProduct?: CartProduct) {
  if (currProduct === undefined) {
    return newProduct;
  }
  if (newProduct.id !== currProduct.id) {
    return currProduct;
  }
  if (
    newProduct.name !== currProduct.name ||
    newProduct.isUp !== currProduct.isUp ||
    newProduct.price !== currProduct.price
  ) {
    return newProduct;
  }
  return currProduct;
}

const useGetCartProduct = (id: number) => {
  const cartProduct = useStore(
    useCallback((store: Store) => store.cartProducts[id], [id]),
  );
  const quantity =
    useStore(useCallback((store: Store) => store.cart[id], [id])) || 0;
  return cartProduct !== undefined
    ? {
        ...cartProduct,
        quantity,
      }
    : undefined;
};

const setCartProduct = (newProduct: CartProduct) => {
  const { id } = newProduct;
  const curProduct = useStore.getState().cartProducts[id];
  const product = cartProductDiff(newProduct, curProduct);
  if (curProduct !== product) {
    useStore.setState(
      produce((store: Store) => {
        store.cartProducts[id] = product;
      }),
    );
  }
};

const stateSelector = (store: Store) => ({
  cart: store.cart,
  cartProducts: store.cartProducts,
});

export const useGetCart = () => {
  const { cart, cartProducts } = useStore(stateSelector);
  const cartRef = useRefInSync(cart);
  const cartProductsRef = useRefInSync(cartProducts);
  const { fixCart } = useSetCart();
  const [result, getProductsByIds] = useGetProductsByIds();
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
  useEffect(() => {
    if (!loading && data) {
      const { products } = data;
      let valid = true;
      const currentCart = cartRef.current;
      const newCartProducts = products.map((p) => {
        const inCart = currentCart[String(p.id)];
        if (inCart === undefined) return p;
        if (!p.isUp) {
          valid = false;
        }
        if (p.quantity < inCart) {
          valid = false;
        }
        return p;
      });
      if (valid) {
        for (const product of newCartProducts) {
          setCartProduct(product);
        }
      } else {
        fixCart(newCartProducts);
      }
    }
  }, [loading, data, cartRef, fixCart]);
  return {
    cart,
    cartProducts,
    loading,
    useGetProduct: useGetCartProduct,
  };
};
