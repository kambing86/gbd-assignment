import { useSelector } from "react-redux";
import { State } from "store";
import { LoadingState } from "store/slices/loading.slice";

const shouldShowLoading = (loadingState: LoadingState) => {
  for (const key in loadingState) {
    if (loadingState[key]) {
      return true;
    }
  }
  return false;
};

export const useShouldShowLoading = () => {
  const loadingState = useSelector((state: State) => state.loading);
  return shouldShowLoading(loadingState);
};
