import { Order } from "hooks/useOrder";
import { useCallback } from "react";
import { Config, createStore } from "state";

type OrderStore = {
  orders: Order[];
  setOrders: (orders: Order[]) => void;
};

const orderConfig: Config<OrderStore> = (set) => ({
  orders: [],
  setOrders: (newOrders) => {
    set((state) => {
      state.orders = newOrders;
    }, "setOrders");
  },
});

const useStore = createStore(orderConfig, "orders");

export const useGetOrder = (id: number) => {
  return useStore(
    useCallback((state) => state.orders.find((o) => o.id === id), [id]),
  );
};

export const { setOrders } = useStore.getState();
