import { Config, createStore } from "state";

type User = {
  username: string;
  isAdmin: boolean;
};

type UserStore = {
  user: User | undefined;
  setUser: (user: User | undefined) => void;
};

const userConfig: Config<UserStore> = (set) => ({
  user: undefined,
  setUser: (user) => {
    set({ user }, "setUser");
  },
});

const useStore = createStore(userConfig, "user");

const stateSelector = (state: UserStore) => state.user;

export const useGetUser = () => {
  return useStore(stateSelector);
};

export const { setUser } = useStore.getState();
