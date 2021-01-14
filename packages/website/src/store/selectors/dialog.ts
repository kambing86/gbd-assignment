import { useSelector } from "react-redux";
import { State } from "store";

export const useGetDialog = () => {
  return useSelector((state: State) => state.dialog);
};
