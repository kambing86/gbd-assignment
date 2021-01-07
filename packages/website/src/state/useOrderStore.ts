import { Order } from "hooks/useOrder";
import { useCallback } from "react";
import { create } from "state";

type Store = {
  orders: Order[];
  setOrders: (orders: Order[]) => void;
};

const useStore = create<Store>(
  (set) => ({
    orders: [],
    setOrders: (newOrders) => {
      set((state) => {
        state.orders = newOrders;
      }, "setOrders");
    },
  }),
  "orders",
);

export const useGetOrder = (id: number) => {
  return useStore(
    useCallback((state: Store) => state.orders.find((o) => o.id === id), [id]),
  );
};

export const { setOrders } = useStore.getState();
