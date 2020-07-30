import { useCallback } from "react";
import { atom, useRecoilValue, useSetRecoilState } from "recoil";

interface LoadingState {
  [key: string]: number;
}

const LOADING_KEY = "loading";
const loadingState = atom<LoadingState>({
  key: LOADING_KEY,
  default: {},
});

const addLoadingKey = (loading: LoadingState, key: string) => {
  if (loading[key]) {
    return {
      ...loading,
      [key]: loading[key] + 1,
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
  if (loading[key]) {
    returnObj = {
      ...loading,
      [key]: loading[key] - 1,
    };
  }
  if (returnObj[key] === 0) {
    delete returnObj[key];
  }
  return returnObj;
};

const shouldShowLoading = (loading: LoadingState) => {
  for (const key in loading) {
    if (loading[key]) {
      return true;
    }
  }
  return false;
};

export const useSetLoadingBackdrop = (loadingKey: string) => {
  const setLoading = useSetRecoilState(loadingState);
  const setLoadingCallback = useCallback(
    (isLoading: boolean) => {
      if (loadingKey === undefined) return;
      if (isLoading) {
        setLoading((prev) => addLoadingKey(prev, loadingKey));
      } else {
        setLoading((prev) => subtractLoadingKey(prev, loadingKey));
      }
    },
    [loadingKey, setLoading],
  );
  return setLoadingCallback;
};

export const useGetLoading = () => {
  const loading = useRecoilValue(loadingState);
  return shouldShowLoading(loading);
};
