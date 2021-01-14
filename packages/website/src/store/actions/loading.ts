import { bindActionCreators } from "@reduxjs/toolkit";
import store from "store";
import { loadingSlice } from "store/slices/loading";

export const loadingActions = bindActionCreators(
  loadingSlice.actions,
  store.dispatch,
);
