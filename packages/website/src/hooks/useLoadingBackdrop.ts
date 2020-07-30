import { useCallback } from "react";
import { atom, useRecoilState } from "recoil";
import { useRefInSync } from "./helpers/useRefInSync";

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

export const shouldShowLoading = (loading: LoadingState) => {
  for (const key in loading) {
    if (loading[key]) {
      return true;
    }
  }
  return false;
};

export const useLoadingBackdrop = (loadingKey?: string) => {
  const [loading, setLoading] = useRecoilState(loadingState);
  const loadingRef = useRefInSync(loading);
  const setLoadingCallback = useCallback(
    (isLoading: boolean) => {
      if (loadingKey === undefined) return;
      if (isLoading) {
        setLoading(addLoadingKey(loadingRef.current, loadingKey));
      } else {
        setLoading(subtractLoadingKey(loadingRef.current, loadingKey));
      }
    },
    [loadingKey, setLoading, loadingRef],
  );
  return { loading, setLoading: setLoadingCallback };
};
