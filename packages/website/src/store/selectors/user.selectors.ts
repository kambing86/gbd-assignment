import { useSelector } from "react-redux";
import { State } from "store";

export const useGetUser = () => {
  return useSelector((state: State) => state.user.user);
};
