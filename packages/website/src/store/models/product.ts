import { createModel } from "@rematch/core";
import { Product } from "hooks/useProducts";
import { RootModel } from ".";

type ProductState = {
  [key: number]: Product | undefined;
};
const initialState: ProductState = {};

export default createModel<RootModel>()({
  state: initialState,
  reducers: {
    setProducts(state, payload: Product[]) {
      const products = payload;
      for (const product of products) {
        const { id } = product;
        const prev = state[id];
        if (prev !== product) {
          state[id] = product;
        }
      }
      return state;
    },
  },
});
