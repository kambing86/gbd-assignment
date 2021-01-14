import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Order } from "hooks/useOrder";

type OrderState = {
  orders: Order[];
};

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

export default orderSlice.reducer;
