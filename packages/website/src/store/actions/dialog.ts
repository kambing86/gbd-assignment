import { bindActionCreators } from "@reduxjs/toolkit";
import store from "store";
import { dialogSlice } from "store/slices/dialog";

export const dialogActions = bindActionCreators(
  dialogSlice.actions,
  store.dispatch,
);
