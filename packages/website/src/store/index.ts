import { configureStore } from "@reduxjs/toolkit";
import cart from "./slices/cart";
import dialog from "./slices/dialog";
import loading from "./slices/loading";
import order from "./slices/order";
import product from "./slices/product";
import theme from "./slices/theme";
import user from "./slices/user";

const store = configureStore({
  reducer: {
    cart,
    dialog,
    loading,
    order,
    product,
    theme,
    user,
  },
  devTools: {
    name: "gbd-assignment",
  },
});

export type State = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
