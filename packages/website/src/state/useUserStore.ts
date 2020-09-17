import { create } from "state";

type User = {
  username: string;
  isAdmin: boolean;
};

type Store = {
  user: User | undefined;
  setUser: (user: User | undefined) => void;
};

const useStore = create<Store>(
  (set) => ({
    user: undefined,
    setUser: (user) => {
      set({ user }, "setUser");
    },
  }),
  "user",
);

const stateSelector = (state: Store) => state.user;

export const useGetUser = () => {
  return useStore(stateSelector);
};

export const { setUser } = useStore.getState();
