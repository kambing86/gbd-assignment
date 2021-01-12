import { useSelector } from "react-redux";
import { State } from "state";

export const useGetDialog = () => {
  return useSelector((state: State) => state.dialog);
};
