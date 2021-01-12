import { Product } from "hooks/useProducts";
import { useCallback } from "react";
import { Config, createStore } from "state";

type ProductState = {
  [key: number]: Product | undefined;
};

type ProductStore = {
  productState: ProductState;
  setProduct: (product: Product) => void;
};

const productConfig: Config<ProductStore> = (set, get) => ({
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
});

const useStore = createStore(productConfig, "product");

export const useGetProduct = (id: number) => {
  return useStore(useCallback((state) => state.productState[id], [id]));
};

export const { setProduct } = useStore.getState();
