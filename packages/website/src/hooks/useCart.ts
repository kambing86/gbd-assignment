import { useCallback, useEffect, useMemo } from "react";
import useCartStore, {
  CartProducts,
  Cart as CartType,
  setCart,
  setCartProduct,
  useGetCartProduct,
} from "state/useCartStore";
import { open as openDialog } from "state/useDialogStore";
import { useRefInSync } from "./helpers/useRefInSync";
import { Product, useGetProductsByIds } from "./useProducts";

export type Cart = CartType;

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
  const addToCart = useCallback((product: Product) => {
    const id = String(product.id);
    setCart((prev) => {
      const existing = prev[id] ?? 0;
      if (product.quantity <= existing) {
        openDialog("Sorry", "No more stock");
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
        openDialog("Sorry", "We only allow add 10 types of items at once");
        return prev;
      }
      return {
        ...prev,
        [id]: 1,
      };
    });
  }, []);
  const removeFromCart = useCallback((id: number) => {
    setCart((prev) => {
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
    setCart((prev) => {
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
    setCart(() => ({}));
  }, []);
  return { addToCart, removeFromCart, fixCart, clearCart };
};

export const useGetCart = () => {
  const { cart, cartProducts } = useCartStore();
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
  const idsChange = JSON.stringify(Object.keys(cart));
  const productIds = useMemo(() => {
    return Object.keys(cart).map((id) => Number(id));
  }, [idsChange]); // eslint-disable-line react-hooks/exhaustive-deps
  const isReady = useMemo(() => {
    const readyIds = Object.keys(cartProducts).map((id) => Number(id));
    for (const id of productIds) {
      if (!readyIds.includes(id)) return false;
    }
    return true;
  }, [cartProducts, productIds]);
  const isLoading = !isReady || loading;
  return {
    cart,
    cartProducts,
    productIds,
    isReady,
    isLoading,
    useGetProduct: useGetCartProduct,
  };
};
