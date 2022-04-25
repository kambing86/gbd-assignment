import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { getData } from "store/thunks/user";
import { StarWarsPeople } from "types/StarWarsPeople";

type User = {
  username: string;
  isAdmin: boolean;
};

type UserState = Readonly<{
  user: User | undefined;
  people: StarWarsPeople | null;
  peopleIsLoading: boolean;
}>;

const initialState: UserState = {
  user: undefined,
  people: null,
  peopleIsLoading: false,
};

export const userSlice = createSlice({
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
        state.people = null;
        state.peopleIsLoading = true;
      })
      .addCase(getData.fulfilled, (state, action) => {
        state.people = action.payload.data;
        state.peopleIsLoading = false;
      });
  },
});

export const userActions = userSlice.actions;

export const userThunkActions = {
  getData,
};

export default userSlice.reducer;
