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
    setProduct(state, action: PayloadAction<Product>) {
      const product = action.payload;
      const { id } = product;
      const prev = state[id];
      if (prev !== product) {
        state[id] = product;
      }
    },
  },
});

export default productSlice.reducer;

const { setProduct } = productSlice.actions;

export const useSetProduct = () => {
  return useAutoDispatch(setProduct);
};
