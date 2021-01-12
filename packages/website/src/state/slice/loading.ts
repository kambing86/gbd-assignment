import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { useCallback } from "react";
import { useDispatch } from "react-redux";

export type LoadingState = {
  [key: string]: number | undefined;
};
const initialState: LoadingState = {};

type SetLoadingPayload = {
  loadingKey: string;
  isLoading: boolean;
};

const loadingSlice = createSlice({
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

const { setLoading } = loadingSlice.actions;

export const useSetLoading = (loadingKey: string) => {
  const dispatch = useDispatch();
  return useCallback(
    (isLoading: boolean) => {
      dispatch(setLoading({ loadingKey, isLoading }));
    },
    [dispatch, loadingKey],
  );
};
