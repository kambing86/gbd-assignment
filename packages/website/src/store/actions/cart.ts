import { bindActionCreators } from "@reduxjs/toolkit";
import store from "store";
import { cartSlice } from "store/slices/cart";

export const cartActions = bindActionCreators(
  cartSlice.actions,
  store.dispatch,
);
