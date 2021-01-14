import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export type LoadingState = {
  [key: string]: number | undefined;
};
const initialState: LoadingState = {};

type SetLoadingPayload = {
  loadingKey: string;
  isLoading: boolean;
};

export const loadingSlice = createSlice({
  name: "loading",
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<SetLoadingPayload>) {
      const { loadingKey, isLoading } = action.payload;
      const { [loadingKey]: curValue } = state;
      const result = (curValue ?? 0) + (isLoading ? 1 : -1);
      if (result <= 0) {
        delete state[loadingKey];
      } else {
        state[loadingKey] = result;
      }
    },
  },
});

export default loadingSlice.reducer;
