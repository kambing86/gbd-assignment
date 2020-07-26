import { useCallback, useRef } from "react";
import { atom, useRecoilState } from "recoil";

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
  let returnObj = loading;
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
  const key = useRef(loadingKey);
  const [loading, setLoading] = useRecoilState(loadingState);
  const loadingRef = useRef(loading);
  loadingRef.current = loading;
  const setLoadingCallback = useCallback(
    (isLoading: boolean) => {
      if (key.current === undefined) return;
      if (isLoading) {
        setLoading(addLoadingKey(loadingRef.current, key.current));
      } else {
        setLoading(subtractLoadingKey(loadingRef.current, key.current));
      }
    },
    [key, setLoading, loadingRef],
  );
  // useDebugValue(loading);
  return { loading, setLoading: setLoadingCallback };
};
