import { Models } from "@rematch/core";
import cart from "./cart";
import dialog from "./dialog";
import loading from "./loading";
import order from "./order";
import product from "./product";
import theme from "./theme";
import user from "./user";

export interface RootModel extends Models<RootModel> {
  cart: typeof cart;
  dialog: typeof dialog;
  loading: typeof loading;
  order: typeof order;
  product: typeof product;
  theme: typeof theme;
  user: typeof user;
}

export const models: RootModel = {
  cart,
  dialog,
  loading,
  order,
  product,
  theme,
  user,
};
