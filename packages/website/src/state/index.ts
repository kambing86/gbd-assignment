import { configureStore } from "@reduxjs/toolkit";
import cart from "./slice/cart";
import dialog from "./slice/dialog";
import loading from "./slice/loading";
import order from "./slice/order";
import product from "./slice/product";
import theme from "./slice/theme";
import user from "./slice/user";

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

export default store;
