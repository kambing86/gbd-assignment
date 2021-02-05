import { useSelector } from "react-redux";
import { RootState } from "store";

export const useGetDialog = () => {
  return useSelector((state: RootState) => state.dialog);
};
