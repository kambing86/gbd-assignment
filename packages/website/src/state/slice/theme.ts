import { PaletteType } from "@material-ui/core";
import { createSlice } from "@reduxjs/toolkit";
import { useAutoDispatch } from "state/useAutoDispatch";

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

const themeSlice = createSlice({
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

export default themeSlice.reducer;

const { toggleTheme } = themeSlice.actions;

export const useToggleTheme = () => {
  return useAutoDispatch(toggleTheme);
};
