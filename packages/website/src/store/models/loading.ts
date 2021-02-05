import { createModel } from "@rematch/core";
import { RootModel } from ".";

export type LoadingState = {
  [key: string]: number | undefined;
};
const initialState: LoadingState = {};

type SetLoadingPayload = {
  loadingKey: string;
  isLoading: boolean;
};

export default createModel<RootModel>()({
  state: initialState,
  reducers: {
    setLoading(state, payload: SetLoadingPayload) {
      const { loadingKey, isLoading } = payload;
      const { [loadingKey]: curValue } = state;
      const result = (curValue ?? 0) + (isLoading ? 1 : -1);
      if (result <= 0) {
        delete state[loadingKey];
      } else {
        state[loadingKey] = result;
      }
      return state;
    },
  },
});
