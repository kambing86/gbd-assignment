import { useCallback, useEffect, useState } from "react";
import {
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
  [id: string]: number;
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
    count += cart[id];
  }
  return count;
};

export const totalAmountCount = (cart: Cart, cartProducts: Product[]) => {
  let amount = 0;
  for (const product of cartProducts) {
    const quantity = cart[String(product.id)];
    if (quantity > 0) {
      amount += quantity * product.price;
    }
  }
  return amount;
};

const useGetCartInLocalStorage = () => {
  const cart = useRecoilValue(cartState);
  useEffect(() => {
    console.log("setItem");
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);
  return cart;
};

export const cartProductsFamily = atomFamily<Product | undefined, number>({
  key: "cartProductsFamily",
  default: undefined,
});

function updater(newProduct: Product, prev?: Product) {
  if (prev === undefined) {
    return newProduct;
  }
  if (newProduct.isUp !== prev.isUp || newProduct.quantity !== prev.quantity) {
    return newProduct;
  }
  return prev;
}

export const useCartProductsState = () => {
  const getCartProduct = useRecoilCallback(
    ({ snapshot }) => async (id: number) => {
      const recoilState = cartProductsFamily(id);
      return await snapshot.getPromise(recoilState);
    },
    [],
  );
  const setCartProduct = useRecoilCallback(
    ({ snapshot, set }) => async (id: number, newProduct: Product) => {
      const recoilState = cartProductsFamily(id);
      const prev = await snapshot.getPromise(recoilState);
      const product = updater(newProduct, prev);
      if (prev !== product) {
        set(recoilState, product);
      }
    },
    [],
  );
  return { getCartProduct, setCartProduct };
};

// limit to 10 different types of product
export const useSetCart = () => {
  const { open } = useSetDialog();
  const setCart = useSetRecoilState(cartState);
  const addToCart = useCallback(
    (product: Product) => {
      const id = String(product.id);
      setCart((prev) => {
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
    [setCart, open],
  );
  const removeFromCart = useCallback(
    (product: Product) => {
      const id = String(product.id);
      setCart((prev) => {
        let returnObj = { ...prev };
        if (prev[id]) {
          returnObj = {
            ...prev,
            [id]: prev[id] - 1,
          };
        }
        if (returnObj[id] === 0) {
          delete returnObj[id];
        }
        return returnObj;
      });
    },
    [setCart],
  );
  const fixCart = useCallback(
    (cartProducts: Product[]) => {
      setCart((prev) => {
        const cartObj = { ...prev };
        for (const key in cartObj) {
          const inCart = cartObj[key];
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
    [setCart],
  );
  const clearCart = useCallback(() => {
    setCart({});
  }, [setCart]);
  return { addToCart, removeFromCart, fixCart, clearCart };
};

export const useGetCart = () => {
  const cart = useGetCartInLocalStorage();
  const cartRef = useRefInSync(cart);
  const { fixCart } = useSetCart();
  const { getCartProduct, setCartProduct } = useCartProductsState();
  const [result, getProductsByIds] = useGetProductsByIds();
  const { loading, data } = result;

  // only triggered when cart changed
  useEffect(() => {
    const ids = Object.keys(cart).map((id) => Number(id));
    getProductsByIds(ids);
  }, [cart, getProductsByIds]);
  useEffect(() => {
    if (!loading && data) {
      const { products } = data;
      let valid = true;
      const currentCart = cartRef.current;
      const newCartProducts = products.map((p) => {
        const inCart = currentCart[String(p.id)];
        if (!p.isUp) {
          valid = false;
        }
        if (p.quantity < inCart) {
          valid = false;
          return {
            ...p,
            quantity: p.quantity,
          };
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
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    (async () => {
      const ids = Object.keys(cart).map((id) => Number(id));
      for (const id of ids) {
        const notFound = (await getCartProduct(id)) === undefined;
        if (notFound) {
          setIsLoading(true);
          return;
        }
      }
      setIsLoading(false);
    })();
  }, [cart, loading, data, getCartProduct, setIsLoading]);
  return {
    cart,
    loading: isLoading,
  };
};
