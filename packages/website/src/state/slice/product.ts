import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Product } from "hooks/useProducts";
import { useAutoDispatch } from "state/useAutoDispatch";

type ProductState = {
  [key: number]: Product | undefined;
};
const initialState: ProductState = {};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setProducts(state, action: PayloadAction<Product[]>) {
      const products = action.payload;
      for (const product of products) {
        const { id } = product;
        const prev = state[id];
        if (prev !== product) {
          state[id] = product;
        }
      }
    },
  },
});

export default productSlice.reducer;

const { setProducts } = productSlice.actions;

export const useSetProducts = () => {
  return useAutoDispatch(setProducts);
};
