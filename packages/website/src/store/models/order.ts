import { createModel } from "@rematch/core";
import { Order } from "hooks/useOrder";
import { RootModel } from ".";

type OrderState = {
  orders: Order[];
};

const initialState: OrderState = { orders: [] };

export default createModel<RootModel>()({
  state: initialState,
  reducers: {
    setOrders(state, payload: Order[]) {
      state.orders = payload;
      return state;
    },
  },
});
