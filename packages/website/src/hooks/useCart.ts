import { useCallback, useEffect, useMemo } from "react";
import {
  SetterOrUpdater,
  atom,
  atomFamily,
  useRecoilCallback,
  useRecoilValue,
  useSetRecoilState,
} from "recoil";
import { useRefInSync } from "./helpers/useRefInSync";
import { useSetDialog } from "./useDialog";
import { Product, useGetProductsByIds } from "./useProducts";

export interface Cart {
  [key: string]: number | undefined;
}

export interface CartProduct {
  [key: number]: Product | undefined;
}

const CART_KEY = "cart";

function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY) || "{}") as Cart;
}

const cartState = atom<Cart>({
  key: CART_KEY,
  default: getCart(),
});

export const totalCartCount = (cart: Cart) => {
  let count = 0;
  for (const id in cart) {
    count += cart[id] as number;
  }
  return count;
};

export const totalAmountCount = (cart: Cart, cartProducts: CartProduct) => {
  let amount = 0;
  for (const id in cart) {
    const quantity = cart[id] as number;
    const product = cartProducts[Number(id)];
    if (product === undefined) continue;
    amount += quantity * product.price;
  }
  return amount;
};

function saveCartToLocalStorage(setCart: SetterOrUpdater<Cart>) {
  return (updater: (prev: Cart) => Cart) => {
    setCart((prev) => {
      const nextCart = updater(prev);
      localStorage.setItem(CART_KEY, JSON.stringify(nextCart));
      return nextCart;
    });
  };
}

// limit to 10 different types of product
export const useSetCart = () => {
  const { open } = useSetDialog();
  const setCart = useSetRecoilState(cartState);
  const saveAndSetCart = useMemo(() => {
    return saveCartToLocalStorage(setCart);
  }, [setCart]);
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
    [saveAndSetCart, open],
  );
  const removeFromCart = useCallback(
    (product: Product) => {
      const id = String(product.id);
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
    },
    [saveAndSetCart],
  );
  const fixCart = useCallback(
    (cartProducts: Product[]) => {
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
    },
    [saveAndSetCart],
  );
  const clearCart = useCallback(() => {
    saveAndSetCart(() => ({}));
  }, [saveAndSetCart]);
  return { addToCart, removeFromCart, fixCart, clearCart };
};

const cartProductsState = atom<CartProduct>({
  key: "cartProductsState",
  default: {},
});

const cartProductsFamily = atomFamily<Product | undefined, number>({
  key: "cartProductsFamily",
  default: undefined,
});

function cartProductDiff(newProduct: Product, currProduct?: Product) {
  if (currProduct === undefined) {
    return newProduct;
  }
  if (newProduct.id !== currProduct.id) {
    return currProduct;
  }
  if (
    newProduct.name !== currProduct.name ||
    newProduct.isUp !== currProduct.isUp ||
    newProduct.quantity !== currProduct.quantity ||
    newProduct.price !== currProduct.price
  ) {
    return newProduct;
  }
  return currProduct;
}

export const useCartProductsState = () => {
  const getCartProductAsync = useRecoilCallback(
    ({ snapshot }) => async (id: number) => {
      const recoilState = cartProductsFamily(id);
      return await snapshot.getPromise(recoilState);
    },
    [],
  );
  const setCartProduct = useRecoilCallback(
    ({ snapshot, set }) => async (id: number, newProduct: Product) => {
      const recoilState = cartProductsFamily(id);
      const curProduct = await snapshot.getPromise(recoilState);
      const product = cartProductDiff(newProduct, curProduct);
      if (curProduct !== product) {
        set(recoilState, product);
        set(cartProductsState, (prev) => ({ ...prev, [id]: product }));
      }
    },
    [],
  );
  return { getCartProductAsync, setCartProduct };
};

export const useGetCart = () => {
  const cart = useRecoilValue(cartState);
  const cartRef = useRefInSync(cart);
  const cartProducts = useRecoilValue(cartProductsState);
  const cartProductsRef = useRefInSync(cartProducts);
  const { fixCart } = useSetCart();
  const { setCartProduct } = useCartProductsState();
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
          return p;
        }
        return {
          ...p,
          quantity: inCart,
        };
      }) as Product[];
      if (valid) {
        for (const product of newCartProducts) {
          setCartProduct(product.id, product);
        }
      } else {
        fixCart(newCartProducts);
      }
    }
  }, [loading, data, setCartProduct, cartRef, fixCart]);
  return {
    cart,
    cartProducts,
    loading,
    cartProductsFamily,
  };
};
