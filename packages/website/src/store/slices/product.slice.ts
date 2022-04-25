import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Product } from "hooks/useProducts";

type ProductState = {
  [key: number]: Product | undefined;
};
const initialState: ProductState = {};

export const productSlice = createSlice({
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

export const productActions = productSlice.actions;

export default productSlice.reducer;
