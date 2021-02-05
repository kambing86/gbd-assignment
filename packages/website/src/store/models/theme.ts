import { PaletteType } from "@material-ui/core";
import { createModel } from "@rematch/core";
import { RootModel } from ".";

const THEME_KEY = "theme";
export const LIGHT = "light";
export const DARK = "dark";

function getSavedType() {
  return localStorage.getItem(THEME_KEY) as PaletteType | null;
}

type ThemeState = {
  themeType: PaletteType | null;
};

const initialState: ThemeState = { themeType: getSavedType() };

export default createModel<RootModel>()({
  state: initialState,
  reducers: {
    toggleTheme(state) {
      const cur = state.themeType;
      const newVal = cur === DARK ? LIGHT : DARK;
      localStorage.setItem(THEME_KEY, newVal);
      state.themeType = newVal;
      return state;
    },
  },
});
