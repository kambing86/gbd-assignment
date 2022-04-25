import { configureStore } from "@reduxjs/toolkit";
import cart from "./slices/cart.slice";
import dialog from "./slices/dialog.slice";
import loading from "./slices/loading.slice";
import order from "./slices/order.slice";
import product from "./slices/product.slice";
import theme from "./slices/theme.slice";
import user from "./slices/user.slice";

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
