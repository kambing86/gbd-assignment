import { PaletteType } from "@material-ui/core";
import { create } from "state";

type Store = {
  themeType: PaletteType | null;
  toggleTheme: () => void;
};

const THEME_KEY = "theme";
export const LIGHT = "light";
export const DARK = "dark";

function getSavedType() {
  return localStorage.getItem(THEME_KEY) as PaletteType | null;
}

const useStore = create<Store>(
  (set, get) => ({
    themeType: getSavedType(),
    toggleTheme: () => {
      const cur = get().themeType;
      const newVal = cur === DARK ? LIGHT : DARK;
      localStorage.setItem(THEME_KEY, newVal);
      set((state) => {
        state.themeType = newVal;
      }, "toggleTheme");
    },
  }),
  THEME_KEY,
);

const stateSelector = (state: Store) => state.themeType;

export default () => {
  return useStore(stateSelector);
};

export const { toggleTheme } = useStore.getState();
