import { bindActionCreators } from "@reduxjs/toolkit";
import store from "store";
import { orderSlice } from "store/slices/order";

export const orderActions = bindActionCreators(
  orderSlice.actions,
  store.dispatch,
);
