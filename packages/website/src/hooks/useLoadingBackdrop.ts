import { useCallback } from "react";
import create, { SetState } from "zustand";

interface LoadingState {
  [key: string]: number | undefined;
}

interface Store {
  loadingState: LoadingState;
  set: SetState<Store>;
}

const useStore = create<Store>((set) => ({
  loadingState: {},
  set,
}));

const dispatchSelector = (store: Store) => store.set;

const addLoadingKey = (loading: LoadingState, key: string) => {
  const val = loading[key];
  if (val) {
    return {
      ...loading,
      [key]: val + 1,
    };
  } else {
    return {
      ...loading,
      [key]: 1,
    };
  }
};

const subtractLoadingKey = (loading: LoadingState, key: string) => {
  let returnObj = { ...loading };
  const val = loading[key];
  if (val) {
    returnObj = {
      ...loading,
      [key]: val - 1,
    };
  }
  if (returnObj[key] === 0) {
    delete returnObj[key];
  }
  return returnObj;
};

const shouldShowLoading = (loadingState: LoadingState) => {
  for (const key in loadingState) {
    if (loadingState[key]) {
      return true;
    }
  }
  return false;
};

export const useSetLoadingBackdrop = (loadingKey: string) => {
  const setLoading = useStore(dispatchSelector);
  const setLoadingCallback = useCallback(
    (isLoading: boolean) => {
      if (loadingKey === undefined) return;
      if (isLoading) {
        setLoading((prev) => ({
          loadingState: addLoadingKey(prev.loadingState, loadingKey),
        }));
      } else {
        setLoading((prev) => ({
          loadingState: subtractLoadingKey(prev.loadingState, loadingKey),
        }));
      }
    },
    [loadingKey, setLoading],
  );
  return setLoadingCallback;
};

export const useGetLoading = () => {
  const loadingState = useStore(
    useCallback((store: Store) => store.loadingState, []),
  );
  return shouldShowLoading(loadingState);
};
