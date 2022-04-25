import { PaletteType } from "@material-ui/core";
import { createSlice } from "@reduxjs/toolkit";

const THEME_KEY = "theme";
export const LIGHT = "light";
export const DARK = "dark";

function getTheme() {
  const saved = localStorage.getItem(THEME_KEY) as PaletteType | null;
  if (saved != null) return saved;
  const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return isDarkMode ? DARK : LIGHT;
}

type ThemeState = Readonly<{
  themeType: PaletteType | null;
}>;

const initialState: ThemeState = { themeType: getTheme() };

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme(state) {
      const cur = state.themeType;
      const newVal = cur === DARK ? LIGHT : DARK;
      localStorage.setItem(THEME_KEY, newVal);
      state.themeType = newVal;
    },
  },
});

export const themeActions = themeSlice.actions;

export default themeSlice.reducer;
