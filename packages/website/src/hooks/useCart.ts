import { useCallback, useEffect, useMemo } from "react";
import {
  atom,
  useRecoilState,
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
const CART_PRODUCTS_KEY = "cartProducts";

function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY) || "{}") as Cart;
}

const cartState = atom<Cart>({
  key: CART_KEY,
  default: getCart(),
});

const cartProductsState = atom<Product[]>({
  key: CART_PRODUCTS_KEY,
  default: [],
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
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);
  return cart;
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

const useCartProductsState = () => {
  return useRecoilState(cartProductsState);
};

export const useGetCart = () => {
  const cart = useGetCartInLocalStorage();
  const cartRef = useRefInSync(cart);
  const { fixCart } = useSetCart();
  const [cartProducts, setCartProducts] = useCartProductsState();
  const [result, getProductsByIds] = useGetProductsByIds();
  const { loading, data } = result;

  // only triggered when cart changed
  useEffect(() => {
    const ids = Object.keys(cart).map((id) => Number(id));
    // sync cartProducts without waiting for query
    setCartProducts((prev) => {
      const filtered = prev
        .filter((p) => ids.includes(p.id))
        .map((p) => ({ ...p, quantity: cart[String(p.id)] }));
      return filtered;
    });
    // query
    getProductsByIds(ids);
  }, [cart, setCartProducts, getProductsByIds]);

  useEffect(() => {
    if (!loading && data) {
      const { products } = data;
      let valid = true;
      const currentCart = cartRef.current;
      const returnObj = products.map((p) => {
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
        setCartProducts(returnObj);
      }
      if (!valid) {
        fixCart(returnObj);
      }
    }
  }, [loading, data, setCartProducts, cartRef, fixCart]);

  const isLoading = useMemo(() => {
    const ids = Object.keys(cart).map((id) => Number(id));
    return ids.some((id) => !cartProducts.find((p) => p.id === id));
  }, [cart, cartProducts]);
  return {
    cart,
    cartProducts,
    loading: isLoading,
  };
};
