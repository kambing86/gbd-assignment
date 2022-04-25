import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Order } from "hooks/useOrder";

type OrderState = Readonly<{
  orders: Order[];
}>;

const initialState: OrderState = { orders: [] };

export const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setOrders(state, action: PayloadAction<Order[]>) {
      const orders = action.payload;
      state.orders = orders;
    },
  },
});

export const orderActions = orderSlice.actions;

export default orderSlice.reducer;
