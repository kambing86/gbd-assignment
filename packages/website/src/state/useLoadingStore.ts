import { useMemo } from "react";
import { create } from "state";

type LoadingState = {
  [key: string]: number | undefined;
};

type Store = {
  loadingState: LoadingState;
  setLoading: (loadingKey: string) => (isLoading: boolean) => void;
};

const useStore = create<Store>(
  (set) => ({
    loadingState: {},
    setLoading: (loadingKey) => (isLoading) => {
      if (loadingKey === undefined) return;
      set((state) => {
        const { [loadingKey]: curValue } = state.loadingState;
        const result = (curValue ?? 0) + (isLoading ? 1 : -1);
        if (result <= 0) {
          delete state.loadingState[loadingKey];
        } else {
          state.loadingState[loadingKey] = result;
        }
      }, "setLoading");
    },
  }),
  "loading",
);

const stateSelector = (state: Store) => state.loadingState;

const dispatchSelector = (state: Store) => state.setLoading;

const shouldShowLoading = (loadingState: LoadingState) => {
  for (const key in loadingState) {
    if (loadingState[key]) {
      return true;
    }
  }
  return false;
};

export const useShouldShowLoading = () => {
  const loadingState = useStore(stateSelector);
  return shouldShowLoading(loadingState);
};

export const useSetLoading = (loadingKey: string) => {
  const setLoading = useStore(dispatchSelector);
  return useMemo(() => setLoading(loadingKey), [setLoading, loadingKey]);
};
