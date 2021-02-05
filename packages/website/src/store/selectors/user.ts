import { useSelector } from "react-redux";
import { RootState } from "store";

export const useGetUser = () => {
  return useSelector((state: RootState) => state.user.user);
};
