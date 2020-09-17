import { Product } from "hooks/useProducts";
import { useCallback } from "react";
import { create } from "state";

type ProductState = {
  [key: number]: Product | undefined;
};

type Store = {
  productState: ProductState;
  setProduct: (product: Product) => void;
};

const useStore = create<Store>(
  (set, get) => ({
    productState: {},
    setProduct: (product) => {
      const { id } = product;
      const prev = get().productState[id];
      if (prev !== product) {
        set((state) => {
          state.productState[id] = product;
        }, "setProduct");
      }
    },
  }),
  "product",
);

export const useGetProduct = (id: number) => {
  return useStore(useCallback((state: Store) => state.productState[id], [id]));
};

export const { setProduct } = useStore.getState();
