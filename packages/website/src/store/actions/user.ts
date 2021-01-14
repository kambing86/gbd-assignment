import { bindActionCreators } from "@reduxjs/toolkit";
import store from "store";
import { userSlide } from "store/slices/user";
import * as userThunk from "store/thunks/user";

export const userActions = bindActionCreators(
  userSlide.actions,
  store.dispatch,
);

export const userThunkActions = bindActionCreators(userThunk, store.dispatch);
