import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Order } from "hooks/useOrder";
import { useAutoDispatch } from "state/useAutoDispatch";

type OrderState = {
  orders: Order[];
};

const initialState: OrderState = { orders: [] };

const orderSlice = createSlice({
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

const { setOrders } = orderSlice.actions;

export const useSetOrders = () => {
  return useAutoDispatch(setOrders);
};
