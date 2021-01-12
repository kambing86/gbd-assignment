import { useSelector } from "react-redux";
import { State } from "state";
import { LoadingState } from "state/slice/loading";

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
