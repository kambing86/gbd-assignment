import { useCallback, useEffect, useMemo } from "react";
import { atom, useRecoilState } from "recoil";
import { useRefInSync } from "./helpers/useRefInSync";
import { useDialog } from "./useDialog";
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

export const totalAmountCount = (cartProducts: Product[]) => {
  let amount = 0;
  for (const product of cartProducts) {
    amount += product.quantity * product.price;
  }
  return amount;
};

// limit to 10 different types of product
const useCartInLocalStorage = () => {
  const [cart, setCart] = useRecoilState(cartState);
  const cartRef = useRefInSync(cart);
  const { open } = useDialog();
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
      const cartObj = { ...cartRef.current };
      for (const key in cartObj) {
        const id = Number(key);
        const inCart = cartObj[key];
        const product = cartProducts.find((p) => p.id === id);
        if (product) {
          if (inCart > product.quantity) {
            cartObj[key] = product.quantity;
          }
          if (!product.isUp || cartObj[key] === 0) {
            delete cartObj[key];
          }
        }
      }
      setCart(cartObj);
    },
    [setCart, cartRef],
  );
  const clearCart = useCallback(() => {
    setCart({});
  }, [setCart]);
  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);
  return { cart, addToCart, removeFromCart, fixCart, clearCart };
};

export const useCart = () => {
  const {
    cart,
    addToCart,
    removeFromCart,
    fixCart,
    clearCart,
  } = useCartInLocalStorage();
  const cartRef = useRefInSync(cart);
  const [cartProducts, setCartProducts] = useRecoilState(cartProductsState);
  const [result, getProductsByIds] = useGetProductsByIds();
  const { loading, data } = result;

  // sync cartProducts without waiting for query
  // only triggered when cart changed
  useEffect(() => {
    const ids = Object.keys(cart).map((id) => Number(id));
    setCartProducts((prev) => {
      const filtered = prev
        .filter((p) => ids.includes(p.id))
        .map((p) => ({ ...p, quantity: cart[String(p.id)] }));
      return filtered;
    });
  }, [cart, setCartProducts]);

  useEffect(() => {
    const ids = Object.keys(cart).map((id) => Number(id));
    getProductsByIds(ids);
  }, [cart, getProductsByIds]);

  useEffect(() => {
    if (!loading && data) {
      const { products } = data;
      let valid = true;
      const returnObj = products.map((p) => {
        const inCart = cartRef.current[String(p.id)];
        if (!p.isUp) {
          valid = false;
        }
        if (p.quantity === 0 && inCart === 0) {
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
  }, [cartProducts, cart]);
  return {
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    cartProducts,
    loading: isLoading,
  };
};
