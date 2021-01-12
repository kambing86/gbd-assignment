import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { useAutoDispatch } from "state/useAutoDispatch";

type User = {
  username: string;
  isAdmin: boolean;
};

type UserState = {
  user: User | undefined;
};

const initialState: UserState = {
  user: undefined,
};

const userSlide = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User | undefined>) {
      const user = action.payload;
      state.user = user;
    },
  },
});

export default userSlide.reducer;

const { setUser } = userSlide.actions;

export const useSetUser = () => {
  return useAutoDispatch(setUser);
};
