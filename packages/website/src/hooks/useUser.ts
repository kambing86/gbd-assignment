import { useCallback } from "react";
import create from "zustand";

interface User {
  username: string;
  isAdmin: boolean;
}

interface Store {
  user: User | undefined;
  setUser: (user: User | undefined) => void;
}

const useStore = create<Store>((set) => ({
  user: undefined,
  setUser: (user) => set({ user }),
}));

const dispatchSelector = (store: Store) => store.setUser;

export const useGetUser = () => {
  return useStore(useCallback((store: Store) => store.user, []));
};

export const useSetUser = () => {
  return useStore(dispatchSelector);
};
