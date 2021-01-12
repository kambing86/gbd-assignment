import { useSelector } from "react-redux";
import { State } from "state";

export const useGetUser = () => {
  return useSelector((state: State) => state.user.user);
};
