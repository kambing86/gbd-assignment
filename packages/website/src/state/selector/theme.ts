import { useSelector } from "react-redux";
import { State } from "state";

export const useThemeType = () => {
  return useSelector((state: State) => state.theme.themeType);
};
