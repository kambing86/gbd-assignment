import {
  PaletteType,
  ThemeOptions,
  createMuiTheme,
  useMediaQuery,
} from "@material-ui/core";
import { useCallback, useEffect } from "react";
import create from "zustand";
import useStateWithRef from "./helpers/useStateWithRef";

// set it here https://material-ui.com/customization/default-theme/
const getTheme = (type: PaletteType) => {
  const options: ThemeOptions =
    type === "dark"
      ? {
          palette: {
            type,
            background: {
              default: "#121212",
            },
            primary: {
              contrastText: "rgba(0, 0, 0, 0.87)",
              dark: "rgb(100, 141, 174)",
              light: "rgb(166, 212, 250)",
              main: "#90caf9",
            },
            secondary: {
              contrastText: "rgba(0, 0, 0, 0.87)",
              dark: "rgb(170, 100, 123)",
              light: "rgb(246, 165, 192)",
              main: "#f48fb1",
            },
          },
        }
      : {
          palette: {
            type,
            action: {
              hover: "rgba(0, 0, 0, 0.1)",
              hoverOpacity: 0.1,
              selected: "rgba(0, 0, 0, 0.2)",
              selectedOpacity: 0.2,
            },
          },
        };
  return createMuiTheme(options);
};

const THEME_TYPE_KEY = "themeType";

function getSavedType() {
  return localStorage.getItem(THEME_TYPE_KEY) as PaletteType | null;
}

interface Store {
  themeType: PaletteType;
  setThemeType: (theme: PaletteType) => void;
}

const useStore = create<Store>((set) => ({
  themeType: getSavedType() ?? "light",
  setThemeType: (theme) => set({ themeType: theme }),
}));

// if user change the theme, it should save to localStorage and use it
// else will change the theme based on the machine dark mode
export const useAppTheme = () => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const { themeType, setThemeType } = useStore();
  const [themeRef, setTheme] = useStateWithRef(getTheme(themeType));
  // if localStorage has no saved theme type, then set using media query
  useEffect(() => {
    if (getSavedType() !== null) return;
    if (prefersDarkMode) {
      setThemeType("dark");
    } else {
      setThemeType("light");
    }
  }, [prefersDarkMode, setThemeType]);
  useEffect(() => {
    if (themeType === "dark") {
      setTheme(getTheme("dark"));
    } else {
      setTheme(getTheme("light"));
    }
  }, [themeType, setTheme]);
  const toggleDarkMode = useCallback(() => {
    if (themeType === "light") {
      localStorage.setItem(THEME_TYPE_KEY, "dark");
      setThemeType("dark");
    } else {
      localStorage.setItem(THEME_TYPE_KEY, "light");
      setThemeType("light");
    }
  }, [themeType, setThemeType]);
  return { theme: themeRef.current, toggleDarkMode };
};
