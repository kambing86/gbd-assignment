import { PaletteType } from "@material-ui/core";
import { Config, createStore } from "state";

type ThemeStore = {
  themeType: PaletteType | null;
  toggleTheme: () => void;
};

const THEME_KEY = "theme";
export const LIGHT = "light";
export const DARK = "dark";

function getSavedType() {
  return localStorage.getItem(THEME_KEY) as PaletteType | null;
}

const themeConfig: Config<ThemeStore> = (set, get) => ({
  themeType: getSavedType(),
  toggleTheme: () => {
    const cur = get().themeType;
    const newVal = cur === DARK ? LIGHT : DARK;
    localStorage.setItem(THEME_KEY, newVal);
    set((state) => {
      state.themeType = newVal;
    }, "toggleTheme");
  },
});

const useStore = createStore(themeConfig, THEME_KEY);

const stateSelector = (state: ThemeStore) => state.themeType;

const useThemeStore = () => useStore(stateSelector);

export default useThemeStore;
export const { toggleTheme } = useStore.getState();
