import { bindActionCreators } from "@reduxjs/toolkit";
import store from "store";
import { productSlice } from "store/slices/product";

export const productActions = bindActionCreators(
  productSlice.actions,
  store.dispatch,
);
