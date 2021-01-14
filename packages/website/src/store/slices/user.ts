import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { getData } from "store/thunks/user";

type User = {
  username: string;
  isAdmin: boolean;
};

type UserState = {
  user: User | undefined;
  people: any | null; // eslint-disable-line @typescript-eslint/no-explicit-any
  peopleIsLoading: boolean;
};

const initialState: UserState = {
  user: undefined,
  people: null,
  peopleIsLoading: false,
};

export const userSlide = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User | undefined>) {
      const user = action.payload;
      state.user = user;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getData.pending, (state) => {
        state.peopleIsLoading = true;
      })
      .addCase(getData.fulfilled, (state, action) => {
        state.people = action.payload;
        state.peopleIsLoading = false;
      });
  },
});

export default userSlide.reducer;
